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

  getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
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
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let resolvedUserId = input.user_id && input.user_id.trim() !== '' ? input.user_id : undefined;

      if (resolvedUserId) {
        const userExists = await ctx.prisma.user.findUnique({ where: { id: resolvedUserId } });
        if (!userExists) {
          // eslint-disable-next-line no-console
          console.warn('Provided user_id does not exist; creating find without user relation');
          resolvedUserId = undefined;
        }
      }

      return await ctx.prisma.find.create({
        data: { ...input, user_id: resolvedUserId },
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
      }),
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

  delete: publicProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.find.delete({
      where: { id: input.id },
    });
  }),

  getPaged: publicProcedure
    .input(
      z
        .object({
          page: z.number().int().min(1).default(1).optional(),
          limit: z.number().int().min(1).max(100).default(10).optional(),
          q: z.string().optional(),
          userId: z.string().optional(),
          cityId: z.number().optional(),
          categoryId: z.number().optional(),
          sortBy: z.enum(['id', 'title', 'time', 'location']).default('id').optional(),
          sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const {
        page = 1,
        limit = 10,
        q,
        userId,
        cityId,
        categoryId,
        sortBy = 'id',
        sortOrder = 'desc',
      } = input ?? {};

      const where = {
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
                { location: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {}),
        ...(userId ? { user_id: userId } : {}),
        ...(cityId ? { city_id: cityId } : {}),
        ...(categoryId ? { category_id: categoryId } : {}),
      } as const;

      const total = await ctx.prisma.find.count({ where });

      const orderBy: any = { [sortBy]: sortOrder };

      const items = await ctx.prisma.find.findMany({
        where,
        include: { user: true, city: true, category: true },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      });

      const totalPages = Math.ceil(total / limit) || 1;

      return {
        items,
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        sortBy,
        sortOrder,
        filters: {
          q: q ?? null,
          userId: userId ?? null,
          cityId: cityId ?? null,
          categoryId: categoryId ?? null,
        },
      };
    }),
});
