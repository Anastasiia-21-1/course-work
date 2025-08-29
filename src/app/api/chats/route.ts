import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { getChats, getChat, getOrCreateChat, markMessagesAsRead, sendMessage } from '@/api/chats';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id as string;

    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('chatId');

    if (chatId) {
      const chat = await getChat(chatId, userId);
      if (!chat) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }

      await markMessagesAsRead(chatId, userId);

      return NextResponse.json({ messages: chat.messages });
    }

    const chats = await getChats(userId);
    return NextResponse.json(chats);
  } catch (error) {
    console.error('GET /api/chats error:', error);
    return NextResponse.json({ error: 'Error fetching chats' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id as string;

    const body = await request.json();
    const { findId, lostId, recipientId, content, chatId } = body as {
      findId?: string;
      lostId?: string;
      recipientId?: string;
      content?: string;
      chatId?: string;
    };

    if (chatId && content) {
      const chat = await prisma.chat.findFirst({
        where: { id: chatId, participants: { some: { userId } } },
        include: { participants: true },
      });
      if (!chat) {
        return NextResponse.json({ error: 'Chat not found or access denied' }, { status: 404 });
      }

      let finalRecipientId = recipientId;
      if (!finalRecipientId) {
        const other = chat.participants.find((p) => p.userId !== userId);
        if (!other) {
          return NextResponse.json({ error: 'Recipient not found in chat' }, { status: 400 });
        }
        finalRecipientId = other.userId;
      }

      const message = await sendMessage(chatId, userId, finalRecipientId, content);
      return NextResponse.json({ message }, { status: 201 });
    }

    if ((findId || lostId) && recipientId) {
      const existing = await prisma.chat.findFirst({
        where: {
          OR: [findId ? { findId } : undefined, lostId ? { lostId } : undefined].filter(
            Boolean,
          ) as any,
          AND: [
            { participants: { some: { userId: session.user.id } } },
            { participants: { some: { userId: recipientId } } },
          ],
        },
        select: { id: true },
      });

      if (existing) {
        if (content) {
          await sendMessage(existing.id, session.user.id, recipientId, content);
        }
        return NextResponse.json({ id: existing.id }, { status: 200 });
      }

      const created = await prisma.chat.create({
        data: {
          ...(findId && { findId }),
          ...(lostId && { lostId }),
          participants: {
            create: [{ userId: session.user.id }, { userId: recipientId }],
          },
        },
        select: { id: true },
      });

      if (content) {
        await sendMessage(created.id, session.user.id, recipientId, content);
      }

      return NextResponse.json({ id: created.id }, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  } catch (error) {
    console.error('POST /api/chats error:', error);
    return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
  }
}
