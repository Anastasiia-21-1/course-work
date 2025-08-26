'use client';

import { useState } from 'react';
import { AppShell, Box, Button, Text, useMantineTheme } from '@mantine/core';
import { IconMessage } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { ChatList } from '@/components/chat/ChatList';
import { ChatWindow } from '@/components/chat/ChatWindow';

export default function MessagesPage() {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [showChatList, setShowChatList] = useState(true);

  const handleBackToList = () => {
    setShowChatList(true);
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    if (isMobile) {
      setShowChatList(false);
    }
  };

  return (
    <Box style={{ height: 'calc(100vh - 60px)' }}>
      {isMobile ? (
        showChatList ? (
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
                <ChatWindow chatId={selectedChatId} currentUserId="" onClose={handleBackToList} />
              </div>
            )}
          </Box>
        )
      ) : (
        <AppShell
          padding="md"
          navbar={{
            width: 300,
            breakpoint: 'sm',
          }}
          styles={{
            main: {
              backgroundColor: 'var(--mantine-color-body)',
              padding: 0,
            },
          }}
        >
          <AppShell.Navbar p="md">
            <ChatList
              onSelectChat={handleSelectChat}
              selectedChatId={selectedChatId || undefined}
            />
          </AppShell.Navbar>
          <AppShell.Main>
            {selectedChatId ? (
              <ChatWindow chatId={selectedChatId} currentUserId="" />
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
                  Select a conversation
                </Text>
                <Text c="dimmed" style={{ maxWidth: '400px' }}>
                  Оберіть чат зі списку або створіть новий
                </Text>
              </Box>
            )}
          </AppShell.Main>
        </AppShell>
      )}
    </Box>
  );
}
