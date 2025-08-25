import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function getOrCreateChat(findId?: string, lostId?: string, userId: string) {
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

  // Create a new chat
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
  return prisma.chat.findUnique({
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
  // Get the chat to ensure it exists and user has access
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

  // Create the message
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

  // Update chat's updatedAt
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

// API Route Handlers
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get('chatId');

  try {
    if (chatId) {
      const chat = await getChat(chatId, session.user.id);
      if (chat) {
        // Mark messages as read when fetching a specific chat
        await markMessagesAsRead(chatId, session.user.id);
      }
      return new Response(JSON.stringify(chat), { status: 200 });
    } else {
      const chats = await getChats(session.user.id);
      return new Response(JSON.stringify(chats), { status: 200 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error fetching chats' }), { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { findId, lostId, recipientId, content } = await req.json();

    if (!recipientId) {
      return new Response(JSON.stringify({ error: 'Recipient ID is required' }), { status: 400 });
    }

    // Get or create chat
    const chat = await getOrCreateChat(findId, lostId, session.user.id);

    // Add recipient to chat if not already a participant
    const isRecipientInChat = chat.participants.some((p) => p.userId === recipientId);
    if (!isRecipientInChat) {
      await prisma.userChat.create({
        data: {
          userId: recipientId,
          chatId: chat.id,
        },
      });
    }

    // If this is a message, send it
    if (content) {
      const message = await sendMessage(chat.id, session.user.id, recipientId, content);
      return new Response(JSON.stringify({ chat, message }), { status: 201 });
    }

    return new Response(JSON.stringify(chat), { status: 200 });
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response(JSON.stringify({ error: 'Error processing request' }), { status: 500 });
  }
}
