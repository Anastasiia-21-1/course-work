'use client';
import { useDeleteFindMutation, useGetFindById } from '@/api/finds';
import { AppContainer } from '@/components/layout/AppContainer';
import { Button, Image } from '@mantine/core';
import { MouseEvent } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { IconTrash } from '@tabler/icons-react';
import { trpc } from '@/lib/trpc';

export default function Page({ params }: { params: { id: string } }) {
  const { data: find, isLoading, error } = useGetFindById(params.id);
  const { data: session } = useSession();
  const router = useRouter();

  const deleteMutation = useDeleteFindMutation();
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
      router.push('/find/my');
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
    const recipientId = find?.user_id;
    if (!recipientId) return;
    try {
      const { id } = await startChat.mutateAsync({ findId: params.id, recipientId });
      router.push(`/messages/${id}`);
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
      <AppContainer title="Знахідка">
        <div>Loading...</div>
      </AppContainer>
    );
  }

  if (error || !find) {
    return (
      <AppContainer title="Знахідка">
        <div>Error: {error?.message || 'Find not found'}</div>
      </AppContainer>
    );
  }

  return (
    <AppContainer title="Знахідка">
      <div className="flex gap-5">
        <img
          src={
            find?.photo ||
            'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
          }
          alt={find?.title || ''}
          className="w-80 h-96 object-cover rounded-lg"
        />
        <div className="space-y-2">
          <h1 className="text-3xl">{find?.title}</h1>
          <p>{find?.description}</p>
          <p>Місто - {find?.city?.name}</p>
          <p>Місце - {find?.location}</p>
          <p>Час - {find?.time}</p>
          <div className="flex gap-2">
            {find?.user_id !== session?.user?.id && (
              <Button onClick={handleStartChat}>Звязатись з людиною</Button>
            )}
            {find?.user_id === session?.user?.id && (
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
