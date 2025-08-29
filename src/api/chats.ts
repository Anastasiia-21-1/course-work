import { prisma } from '@/lib/prisma';

export async function getOrCreateChat(userId: string, findId?: string, lostId?: string) {
  if (!findId && !lostId) {
    throw new Error('Either findId or lostId must be provided');
  }

  const existingChat = await prisma.chat.findFirst({
    where: {
      OR: [{ findId }, { lostId }],
      participants: {
        some: {
          userId: userId,
        },
      },
    },
    include: {
      participants: true,
      findItem: true,
      lostItem: true,
      messages: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    },
  });

  if (existingChat) {
    return existingChat;
  }

  const newChat = await prisma.chat.create({
    data: {
      ...(findId && { findId }),
      ...(lostId && { lostId }),
      participants: {
        create: {
          userId: userId,
        },
      },
    },
    include: {
      participants: true,
      findItem: true,
      lostItem: true,
      messages: true,
    },
  });

  return newChat;
}

export async function getChats(userId: string) {
  return prisma.chat.findMany({
    where: {
      participants: {
        some: {
          userId: userId,
        },
      },
    },
    include: {
      participants: {
        include: {
          user: true,
        },
      },
      findItem: true,
      lostItem: true,
      messages: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
}

export async function getChat(chatId: string, userId: string) {
  return prisma.chat.findFirst({
    where: {
      id: chatId,
      participants: {
        some: {
          userId: userId,
        },
      },
    },
    include: {
      participants: {
        include: {
          user: true,
        },
      },
      findItem: true,
      lostItem: true,
      messages: {
        orderBy: {
          createdAt: 'asc',
        },
        include: {
          sender: true,
          recipient: true,
        },
      },
    },
  });
}

export async function sendMessage(
  chatId: string,
  senderId: string,
  recipientId: string,
  content: string,
) {
  const chat = await prisma.chat.findUnique({
    where: {
      id: chatId,
      participants: {
        some: {
          userId: senderId,
        },
      },
    },
  });

  if (!chat) {
    throw new Error('Chat not found or access denied');
  }

  const message = await prisma.message.create({
    data: {
      content,
      chatId,
      senderId,
      recipientId,
      read: false,
    },
    include: {
      sender: true,
      recipient: true,
    },
  });

  await prisma.chat.update({
    where: { id: chatId },
    data: { updatedAt: new Date() },
  });

  return message;
}

export async function markMessagesAsRead(chatId: string, userId: string) {
  await prisma.message.updateMany({
    where: {
      chatId,
      recipientId: userId,
      read: false,
    },
    data: {
      read: true,
    },
  });
}
