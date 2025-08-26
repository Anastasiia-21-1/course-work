'use client';
import { AppContainer } from '@/components/layout/AppContainer';
import { Button, Image } from '@mantine/core';
import { useGetLostById } from '@/api/losts';

export default function Page({ params }: { params: { id: string } }) {
  const { data: lost, isLoading, error } = useGetLostById(params.id);

  if (isLoading) {
    return (
      <AppContainer title="Втрата">
        <div>Loading...</div>
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
        <Image src={lost?.photo ?? ''} alt="" className="w-80 h-96 object-cover rounded-lg" />
        <div className="space-y-2">
          <h1 className="text-3xl">{lost?.title}</h1>
          <p>{lost?.description}</p>
          <p>Місто - {lost?.city?.name}</p>
          <p>Місце - {lost?.location}</p>
          <p>Час - {lost?.time}</p>
          <div className="flex gap-2">
            <Button>Звязатись з людиною</Button>
            <Button>Поскаржитись</Button>
          </div>
        </div>
      </div>
    </AppContainer>
  );
}
