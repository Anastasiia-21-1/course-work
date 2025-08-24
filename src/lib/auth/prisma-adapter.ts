import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const prismaAdapter = PrismaAdapter(prisma); 