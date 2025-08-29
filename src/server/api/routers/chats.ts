import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, publicProcedure } from '@/server/trpc';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';

export const chatsRouter = createTRPCRouter({
  list: publicProcedure.query(async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    const userId = session.user.id;
    const chats = await prisma.chat.findMany({
      where: { participants: { some: { userId } } },
      include: {
        participants: { include: { user: true } },
        findItem: true,
        lostItem: true,
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { updatedAt: 'desc' },
    });
    return chats;
  }),
  unreadCount: publicProcedure.query(async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    const userId = session.user.id;
    const count = await prisma.message.count({ where: { recipientId: userId, read: false } });
    return { count };
  }),
  messages: publicProcedure
    .input(z.object({ chatId: z.string() }))
    .query(async ({ input }) => {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      const userId = session.user.id;
      const chat = await prisma.chat.findFirst({
        where: { id: input.chatId, participants: { some: { userId } } },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            include: { sender: true, recipient: true },
          },
        },
      });
      if (!chat) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }
      await prisma.message.updateMany({
        where: { chatId: input.chatId, recipientId: userId, read: false },
        data: { read: true },
      });
      return { messages: chat.messages };
    }),
  send: publicProcedure
    .input(z.object({ chatId: z.string(), content: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      const userId = session.user.id;
      const chat = await prisma.chat.findFirst({
        where: { id: input.chatId, participants: { some: { userId } } },
        include: { participants: true },
      });
      if (!chat) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }
      const other = chat.participants.find((p) => p.userId !== userId);
      if (!other) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }
      const message = await prisma.message.create({
        data: {
          content: input.content,
          chatId: input.chatId,
          senderId: userId,
          recipientId: other.userId,
          read: false,
        },
        include: { sender: true, recipient: true },
      });
      await prisma.chat.update({ where: { id: input.chatId }, data: { updatedAt: new Date() } });
      return { message };
    }),
  startForItem: publicProcedure
    .input(
      z.object({
        recipientId: z.string(),
        findId: z.string().optional(),
        lostId: z.string().optional(),
        content: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      const userId = session.user.id;
      const { recipientId, findId, lostId, content } = input;
      const existing = await prisma.chat.findFirst({
        where: {
          OR: [findId ? { findId } : undefined, lostId ? { lostId } : undefined].filter(Boolean) as any,
          AND: [
            { participants: { some: { userId } } },
            { participants: { some: { userId: recipientId } } },
          ],
        },
        select: { id: true },
      });
      if (existing) {
        if (content) {
          await prisma.message.create({
            data: {
              content,
              chatId: existing.id,
              senderId: userId,
              recipientId,
              read: false,
            },
          });
          await prisma.chat.update({ where: { id: existing.id }, data: { updatedAt: new Date() } });
        }
        return { id: existing.id };
      }
      const created = await prisma.chat.create({
        data: {
          ...(findId ? { findId } : {}),
          ...(lostId ? { lostId } : {}),
          participants: { create: [{ userId }, { userId: recipientId }] },
        },
        select: { id: true },
      });
      if (content) {
        await prisma.message.create({
          data: {
            content,
            chatId: created.id,
            senderId: userId,
            recipientId,
            read: false,
          },
        });
        await prisma.chat.update({ where: { id: created.id }, data: { updatedAt: new Date() } });
      }
      return { id: created.id };
    }),
});

import { prisma } from '@/lib/prisma';
