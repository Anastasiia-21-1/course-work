import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/trpc';

export const categoryRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.category.findMany({
      include: {
        losts: true,
        finds: true,
      },
    });
  }),

  getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    return await ctx.prisma.category.findUnique({
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
        icon: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.category.create({
        data: input,
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        icon: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.prisma.category.update({
        where: { id },
        data,
      });
    }),

  delete: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.category.delete({
      where: { id: input.id },
    });
  }),
});
