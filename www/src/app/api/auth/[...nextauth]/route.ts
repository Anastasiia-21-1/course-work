import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import {JWT} from "next-auth/jwt";
import {HasuraAdapter} from "next-auth-hasura-adapter";
import * as jsonwebtoken from "jsonwebtoken";

const handler = NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true
        }),
    ],
    adapter: HasuraAdapter({
        endpoint: process.env.HASURA_PROJECT_ENDPOINT!,
        adminSecret: process.env.HASURA_ADMIN_SECRET!,
    }),
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
        // Add the required Hasura claims
        // https://hasura.io/docs/latest/graphql/core/auth/authentication/jwt/#the-spec
        async jwt({token}: any) {
            return {
                ...token,
                // // @ts-ignore
                // "sub": token?.id.toString(),
                // "name": token.name,
                // "email": token.email,
                // "iat": Date.now() / 1000,
                // "exp": Math.floor(Date.now() / 1000) + (24 * 60 * 60),
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
