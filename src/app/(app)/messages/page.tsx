'use client';

import { useState } from 'react';
import { Box, Button, Text } from '@mantine/core';
import { IconMessage } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { ChatList } from '@/components/chat/ChatList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { useSession } from 'next-auth/react';

export default function MessagesPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [showChatList, setShowChatList] = useState(true);
  const { data: session } = useSession();
  const currentUserId = session?.user?.id || '';

  const handleBackToList = () => {
    setShowChatList(true);
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    if (isMobile) {
      setShowChatList(false);
    }
  };

  if (isMobile) {
    return (
      <Box>
        {showChatList ? (
          <ChatList onSelectChat={handleSelectChat} />
        ) : (
          <Box style={{ height: '100%', position: 'relative' }}>
            <Button
              variant="subtle"
              onClick={handleBackToList}
              style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                zIndex: 10,
              }}
            >
              ← Back to conversations
            </Button>
            {selectedChatId && (
              <div style={{ height: '100%', paddingTop: '3rem' }}>
                <ChatWindow
                  chatId={selectedChatId}
                  currentUserId={currentUserId}
                  onClose={handleBackToList}
                />
              </div>
            )}
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box style={{ height: 'calc(100vh - 80px)' }}>
      <Box
        style={{
          display: 'flex',
          height: '100%',
          alignItems: 'stretch',
        }}
      >
        <Box
          style={{
            width: 450,
            borderRight: '1px solid #e9ecef',
            overflow: 'hidden',
          }}
        >
          <ChatList onSelectChat={handleSelectChat} selectedChatId={selectedChatId || undefined} />
        </Box>
        <Box style={{ flex: 1, overflow: 'hidden' }}>
          {selectedChatId ? (
            <ChatWindow chatId={selectedChatId} currentUserId={currentUserId} />
          ) : (
            <Box
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '2rem',
              }}
            >
              <IconMessage size={64} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <Text size="xl" fw={500} mb="sm">
                Почніть спілкування
              </Text>
              <Text c="dimmed" style={{ maxWidth: '400px' }}>
                Оберіть чат зі списку або створіть новий
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
