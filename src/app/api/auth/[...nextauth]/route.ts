import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import {JWT} from "next-auth/jwt";
import * as jsonwebtoken from "jsonwebtoken";
import { prismaAdapter } from "@/lib/auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { env } from "@/utils/env.mjs";

const handler = NextAuth({
    secret: env.NEXTAUTH_SECRET,
    providers: [
        GithubProvider({
            clientId: env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true
        }),
        GoogleProvider({
            clientId: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true
        }),
        CredentialsProvider({
            name: "Email and Password",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "example@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log({CREDENTIALS: credentials})
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }
                
                try {
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email }
                    });
                    
                    if (!user || !user.password) {
                        console.log("User not found or no password");
                        return null;
                    }

                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                    
                    if (!isPasswordValid) {
                        console.log("Invalid password");
                        return null;
                    }
                    
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name || `${user.first_name} ${user.last_name}`,
                        image: user.image
                    };
                } catch (error) {
                    console.error("Error in credentials authorization:", error);
                    return null;
                }
            }
        }),
    ],
    adapter: prismaAdapter,
    theme: {
        colorScheme: "auto",
    },
    session: {strategy: "jwt"},
    jwt: {
        encode: ({secret, token}: any) => {
            return jsonwebtoken.sign(token!, secret, {
                algorithm: "HS256",
            });
        },
        decode: async ({secret, token}: any) => {
            const decodedToken = jsonwebtoken.verify(token!, secret, {
                algorithms: ["HS256"],
            });
            return decodedToken as JWT;
        },
    },
    callbacks: {
        async jwt({token}: any) {
            return {
                ...token,
                "https://hasura.io/jwt/claims": {
                    "x-hasura-allowed-roles": ["user"],
                    "x-hasura-default-role": "user",
                    "x-hasura-role": "user",
                    "x-hasura-user-id": token.sub,
                },
            };
        },
        session: async ({session, token}: any) => {
            if (session?.user) {
                session.user.id = token.sub!;
            }
            return session;
        },
    },
});

export {handler as GET, handler as POST}
