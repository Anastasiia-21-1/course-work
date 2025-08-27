'use client';
import { useDeleteFindMutation, useGetFindById } from '@/api/finds';
import { AppContainer } from '@/components/layout/AppContainer';
import { Button, Image } from '@mantine/core';
import { MouseEvent } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { IconTrash } from '@tabler/icons-react';

export default function Page({ params }: { params: { id: string } }) {
  const { data: find, isLoading, error } = useGetFindById(params.id);
  const { data: session } = useSession();
  const router = useRouter();

  const deleteMutation = useDeleteFindMutation();
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
        <Image src={find?.photo ?? ''} alt="" className="w-80 h-96 object-cover rounded-lg" />
        <div className="space-y-2">
          <h1 className="text-3xl">{find?.title}</h1>
          <p>{find?.description}</p>
          <p>Місто - {find?.city?.name}</p>
          <p>Місце - {find?.location}</p>
          <p>Час - {find?.time}</p>
          <div className="flex gap-2">
            <Button>Звязатись з людиною</Button>
            <Button>Поскаржитись</Button>
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
