'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Text,
  TextInput,
  Button,
  Avatar,
  Group,
  Paper,
  ScrollArea,
  Stack,
  ActionIcon,
} from '@mantine/core';
import { IconSend, IconMessage } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

interface Message {
  id: string;
  content: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
  chatId: string;
  senderId: string;
  recipientId: string;
  read: boolean;
  sender?: {
    id: string;
    name: string | null;
    image: string | null;
  };
  recipient?: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface ChatWindowProps {
  chatId: string;
  currentUserId: string;
  onClose?: () => void;
}

export function ChatWindow({ chatId, currentUserId, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  interface FetchMessagesResponse {
    messages: Message[];
  }

  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get<FetchMessagesResponse>(`/api/chats?chatId=${chatId}`);
        setMessages(data.messages || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  interface SendMessageResponse {
    message: Message;
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId || !session?.user) return;

    const tempId = Date.now().toString();
    const tempMessage = {
      id: tempId,
      content: newMessage,
      chatId,
      senderId: session.user.id,
      recipientId: messages[0]?.recipientId || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      read: false,
      sender: {
        id: session.user.id,
        name: session.user.name || null,
        image: session.user.image || null,
      },
    };

    setMessages((prev) => [...prev, tempMessage as Message]);
    setNewMessage('');

    try {
      const { data } = await axios.post<SendMessageResponse>('/api/chats', {
        chatId,
        content: newMessage,
        recipientId: messages[0]?.recipientId,
      });

      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== tempId);
        return [...filtered, data.message];
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    }
  };

  if (isLoading) {
    return (
      <Box
        p="md"
        style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Text>Loading messages...</Text>
      </Box>
    );
  }

  return (
    <Box style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box p="md" style={{ borderBottom: '1px solid #eee' }}>
        <Group justify="space-between">
          <Group gap="xs">
            <IconMessage />
            <Text fw={500}>Chat</Text>
          </Group>
          {onClose && (
            <ActionIcon onClick={onClose} size="sm" variant="subtle">
              ×
            </ActionIcon>
          )}
        </Group>
      </Box>

      <ScrollArea style={{ flex: 1, padding: '1rem' }}>
        <Stack gap="md">
          {messages.length === 0 ? (
            <Text c="dimmed" style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              No messages yet. Send a message to start the conversation!
            </Text>
          ) : (
            messages.map((message) => (
              <Box
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.senderId === currentUserId ? 'flex-end' : 'flex-start',
                }}
              >
                <Paper
                  p="md"
                  style={{
                    maxWidth: '80%',
                    backgroundColor: message.senderId === currentUserId ? '#e3f2fd' : '#f5f5f5',
                    borderRadius: '8px',
                  }}
                >
                  <Text size="sm" color="dimmed">
                    {message.senderId === currentUserId ? 'You' : message.sender?.name || 'User'}
                  </Text>
                  <Text>{message.content}</Text>
                  <Text size="xs" color="dimmed" style={{ textAlign: 'right' }} mt={4}>
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </Paper>
              </Box>
            ))
          )}
          <div ref={messagesEndRef} />
        </Stack>
      </ScrollArea>

      <Box p="md" style={{ borderTop: '1px solid #eee' }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <Group gap="sm">
            <TextInput
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{ flex: 1 }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              type="submit"
              leftSection={<IconSend size={16} />}
              disabled={!newMessage.trim()}
            >
              Send
            </Button>
          </Group>
        </form>
      </Box>
    </Box>
  );
}
