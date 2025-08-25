'use client';

import { useEffect, useState } from 'react';
import { Avatar, Badge, Box, Group, Paper, ScrollArea, Skeleton, Stack, Text } from '@mantine/core';
import { IconMessage } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Chat {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  findId: string | null;
  lostId: string | null;
  participants: Array<{
    id: string;
    userId: string;
    chatId: string;
    user: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
    };
  }>;
  findItem: {
    id: string;
    title: string | null;
  } | null;
  lostItem: {
    id: string;
    title: string | null;
  } | null;
  messages: Array<{
    id: string;
    content: string;
    createdAt: Date | string;
    read: boolean;
    senderId: string;
  }>;
}

interface ChatWithRelations
  extends Omit<Chat, 'participants' | 'findItem' | 'lostItem' | 'messages'> {
  participants: Array<{
    id: string;
    userId: string;
    chatId: string;
    user: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
    };
  }>;
  findItem: {
    id: string;
    title: string | null;
  } | null;
  lostItem: {
    id: string;
    title: string | null;
  } | null;
  messages: Array<{
    id: string;
    content: string;
    createdAt: Date | string;
    read: boolean;
    senderId: string;
  }>;
}

interface ChatListProps {
  onSelectChat?: (chatId: string) => void;
  selectedChatId?: string;
}

export function ChatList({ onSelectChat, selectedChatId }: ChatListProps) {
  const [chats, setChats] = useState<ChatWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();

  const currentUser = session?.user;

  useEffect(() => {
    const fetchChats = async () => {
      if (!currentUser?.id) return;

      try {
        setIsLoading(true);
        const response = await fetch('/api/chats');
        if (response.ok) {
          const data = await response.json();
          setChats(data);
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
    // Refresh chats every 30 seconds
    const interval = setInterval(fetchChats, 30000);
    return () => clearInterval(interval);
  }, [currentUser?.id, session?.user?.id]);

  if (!session?.user) {
    return (
      <Box p="md" style={{ textAlign: 'center' }}>
        <Text>Please sign in to view your messages</Text>
      </Box>
    );
  }

  const getChatTitle = (chat: ChatWithRelations) => {
    if (chat.findItem) return `Found: ${chat.findItem.title || 'Unknown Item'}`;
    if (chat.lostItem) return `Lost: ${chat.lostItem.title || 'Unknown Item'}`;
    return 'Chat';
  };

  const getOtherParticipant = (chat: ChatWithRelations) => {
    if (!currentUser?.id) return null;
    return chat.participants.find((p) => p.user.id !== session?.user?.id);
  };

  if (isLoading) {
    return (
      <Stack gap="md" p="md">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} height={80} radius="md" />
        ))}
      </Stack>
    );
  }

  if (chats.length === 0) {
    return (
      <Box p="md" style={{ textAlign: 'center' }}>
        <IconMessage size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
        <Text color="dimmed">No conversations yet</Text>
        <Text size="sm" color="dimmed" mt="xs">
          Тут поки немає чатів
        </Text>
      </Box>
    );
  }

  return (
    <ScrollArea style={{ height: '100%' }}>
      <Stack gap="xs" p="xs">
        {chats.map((chat) => {
          const lastMessage = chat.messages[0];
          const otherParticipant = getOtherParticipant(chat);
          const isUnread =
            lastMessage && !lastMessage.read && lastMessage.senderId !== currentUser?.id;

          return (
            <Paper
              key={chat.id}
              p="md"
              withBorder
              shadow={selectedChatId === chat.id ? 'sm' : undefined}
              style={{
                cursor: 'pointer',
                borderLeft: isUnread ? '3px solid #4dabf7' : undefined,
                backgroundColor: selectedChatId === chat.id ? '#f8f9fa' : 'white',
                transition: 'all 0.2s',
              }}
              onClick={() => {
                if (onSelectChat) {
                  onSelectChat(chat.id);
                } else {
                  router.push(`/messages/${chat.id}`);
                }
              }}
            >
              <Group justify="space-between" wrap="nowrap">
                <Group wrap="nowrap" gap="sm">
                  <Avatar
                    src={otherParticipant?.user?.image}
                    alt={otherParticipant?.user?.name || 'User'}
                    radius="xl"
                    size="md"
                  />
                  <Box style={{ minWidth: 0 }}>
                    <Group gap="xs">
                      <Text
                        fw={500}
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {getChatTitle(chat)}
                      </Text>
                      {isUnread && (
                        <Badge size="xs" color="blue">
                          New
                        </Badge>
                      )}
                    </Group>
                    <Text
                      size="sm"
                      color="dimmed"
                      style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      {lastMessage?.content || 'No messages yet'}
                    </Text>
                  </Box>
                </Group>
                {lastMessage && (
                  <Text size="xs" color="dimmed">
                    {new Date(lastMessage.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                )}
              </Group>
            </Paper>
          );
        })}
      </Stack>
    </ScrollArea>
  );
}
