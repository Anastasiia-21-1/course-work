import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/trpc';

export const findRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.find.findMany({
      include: {
        user: true,
        city: true,
        category: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.find.findUnique({
        where: { id: input.id },
        include: {
          user: true,
          city: true,
          category: true,
        },
      });
    }),

  getByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.find.findMany({
        where: { user_id: input.userId },
        include: {
          user: true,
          city: true,
          category: true,
        },
        orderBy: {
          id: 'desc',
        },
      });
    }),

  getByCategory: publicProcedure
    .input(z.object({ categoryId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.find.findMany({
        where: { category_id: input.categoryId },
        include: {
          user: true,
          city: true,
          category: true,
        },
        orderBy: {
          id: 'desc',
        },
      });
    }),

  getByCity: publicProcedure
    .input(z.object({ cityId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.find.findMany({
        where: { city_id: input.cityId },
        include: {
          user: true,
          city: true,
          category: true,
        },
        orderBy: {
          id: 'desc',
        },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        photo: z.string().optional(),
        time: z.string().optional(),
        location: z.string().optional(),
        user_id: z.string().optional(),
        city_id: z.number().optional(),
        category_id: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.find.create({
        data: input,
        include: {
          user: true,
          city: true,
          category: true,
        },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        photo: z.string().optional(),
        time: z.string().optional(),
        location: z.string().optional(),
        city_id: z.number().optional(),
        category_id: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.prisma.find.update({
        where: { id },
        data,
        include: {
          user: true,
          city: true,
          category: true,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.find.delete({
        where: { id: input.id },
      });
    }),
}); 