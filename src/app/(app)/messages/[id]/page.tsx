'use client';

import { useParams, useRouter } from 'next/navigation';
import { Box, Button } from '@mantine/core';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { useSession } from 'next-auth/react';

export default function ChatByIdPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const chatId = (params?.id as string) || '';
  const currentUserId = session?.user?.id || '';

  if (!chatId) return null;

  return (
    <Box style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column' }}>
      <Box p="sm">
        <Button variant="subtle" onClick={() => router.push('/messages')}>{'<'} Назад до чатів</Button>
      </Box>
      <Box style={{ flex: 1 }}>
        <ChatWindow chatId={chatId} currentUserId={currentUserId} />
      </Box>
    </Box>
  );
}
