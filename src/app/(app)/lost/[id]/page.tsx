'use client';
import { AppContainer } from '@/components/layout/AppContainer';
import { Button, Image } from '@mantine/core';
import { useDeleteLostMutation, useGetLostById } from '@/api/losts';
import { MouseEvent } from 'react';
import { IconTrash } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';

export default function Page({ params }: { params: { id: string } }) {
  const { data: lost, isLoading, error } = useGetLostById(params.id);
  const { data: session } = useSession();
  const router = useRouter();

  const deleteMutation = useDeleteLostMutation();
  const startChat = trpc.chats.startForItem.useMutation();
  const handleDelete = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!params.id || !session?.user?.id) return;
    const confirmed = window.confirm('Ви впевнені, що хочете видалити цей запис?');
    if (!confirmed) return;
    try {
      await deleteMutation.mutateAsync({ id: params.id, userId: session.user.id });
      router.refresh();
      router.push('/lost/my');
    } catch (error) {
      console.error('Помилка при видаленні запису:', error);
      alert('Не вдалося видалити запис. Можливо, у вас немає прав.');
    }
  };

  const handleStartChat = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session?.user) {
      router.push('/api/auth/signin');
      return;
    }
    const recipientId = lost?.user_id;
    if (!recipientId) return;
    try {
      await startChat.mutateAsync({ lostId: params.id, recipientId });
      router.push(`/messages`);
    } catch (err) {
      console.error('Error starting chat:', err);
      alert('Не вдалося створити чат. Спробуйте пізніше.');
    }
  };

  const handleComplain = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    alert('Дякуємо за відгук! Функціонал скарг буде додано пізніше.');
  };

  if (isLoading) {
    return (
      <AppContainer title="Втрата">
        <div>Завантаження...</div>
      </AppContainer>
    );
  }

  if (error || !lost) {
    return (
      <AppContainer title="Втрата">
        <div>Error: {error?.message || 'Lost item not found'}</div>
      </AppContainer>
    );
  }

  return (
    <AppContainer title="Втрата">
      <div className="flex gap-5">
        <img src={lost?.photo ?? ''} alt="" className="w-80 h-96 object-cover rounded-lg" />
        <div className="space-y-2">
          <h1 className="text-3xl">{lost?.title}</h1>
          <p>{lost?.description}</p>
          <p>Місто - {lost?.city?.name}</p>
          <p>Місце - {lost?.location}</p>
          <p>Час - {lost?.time}</p>
          <div className="flex gap-2">
            {lost?.user_id !== session?.user?.id && (
              <Button onClick={handleStartChat}>Звязатись з людиною</Button>
            )}
            {lost?.user_id === session?.user?.id && (
              <Button
                color="red"
                variant="light"
                radius="xl"
                onClick={handleDelete}
                leftSection={<IconTrash size={18} />}
              >
                Видалити запис
              </Button>
            )}
          </div>
        </div>
      </div>
    </AppContainer>
  );
}
