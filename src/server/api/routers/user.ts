import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/trpc';

export const userRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany({
      include: {
        losts: true,
        finds: true,
      },
    });
  }),

  getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    return await ctx.prisma.user.findUnique({
      where: { id: input.id },
      include: {
        losts: true,
        finds: true,
      },
    });
  }),

  getByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        first_name: z.string().optional(),
        last_name: z.string().optional(),
        name: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.create({
        data: input,
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        email: z.string().email().optional(),
        first_name: z.string().optional(),
        last_name: z.string().optional(),
        name: z.string().optional(),
        image: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.prisma.user.update({
        where: { id },
        data,
      });
    }),

  delete: publicProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.user.delete({
      where: { id: input.id },
    });
  }),
});
