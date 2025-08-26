import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/trpc';

export const cityRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.city.findMany({
      include: {
        losts: true,
        finds: true,
      },
    });
  }),

  getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    return await ctx.prisma.city.findUnique({
      where: { id: input.id },
      include: {
        losts: true,
        finds: true,
      },
    });
  }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.city.create({
        data: input,
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.prisma.city.update({
        where: { id },
        data,
      });
    }),

  delete: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.city.delete({
      where: { id: input.id },
    });
  }),
});
