import { ActionIcon, Button, Card, Center, Group, Text } from '@mantine/core';
import { IconBuilding, IconClock, IconMap, IconMessage } from '@tabler/icons-react';
import classes from './LostCard.module.css';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { MouseEvent } from 'react';

interface Props {
  id?: string;
  title?: string | null;
  photo?: string | null;
  description?: string | null;
  location?: string | null;
  time?: string | null;
  city?: {
    name?: string | null;
  } | null;
  userId?: string | null;
}

export function LostCard({ id, title, photo, description, location, time, city, userId }: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  interface ChatResponse {
    id: string;
  }

  const handleStartChat = async (e: MouseEvent) => {
    e.stopPropagation();

    if (!session?.user) {
      router.push('/api/auth/signin');
      return;
    }

    if (!userId) return;

    try {
      const { data: chat } = await axios.post<ChatResponse>('/api/chats', {
        recipientId: userId,
        lostId: id,
      });
      router.push(`/messages/${chat.id}`);
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };
  const badges = [
    { label: time, icon: IconClock },
    { label: location, icon: IconMap },
    { label: city?.name, icon: IconBuilding },
  ] as const;

  const features = badges.map((feature) => {
    if (!feature.label) {
      return null;
    }
    return (
      <Center key={feature.label}>
        <feature.icon size="1.05rem" className={classes.icon} stroke={1.5} />
        <Text size="xs">{feature.label}</Text>
      </Center>
    );
  });

  return (
    <Card withBorder radius="md" className={classes.card}>
      <Card.Section className={classes.imageSection}>
        <img
          className="w-full h-48 object-cover"
          src={
            photo || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
          }
          alt={'' + title}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            const fallback =
              'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';
            if (target.src !== fallback) target.src = fallback;
          }}
        />
      </Card.Section>

      <Group justify="space-between" className="line-clamp-3" mt="md" h={90}>
        <div>
          <Text fw={500}>{title}</Text>
          {description && (
            <Text fz="xs" c="dimmed">
              {description}
            </Text>
          )}
        </div>
      </Group>

      <Card.Section className={classes.section} h={70} mt="md">
        <Group>{features}</Group>
      </Card.Section>

      <Card.Section className={classes.section}>
        <Group justify="space-between" wrap="nowrap">
          <Link href={`/lost/${id}`} style={{ flex: 1 }}>
            <Button radius="xl" fullWidth>
              Детальніше
            </Button>
          </Link>
          {userId && userId !== session?.user?.id && (
            <ActionIcon
              variant="filled"
              color="blue"
              size="lg"
              radius="xl"
              onClick={handleStartChat}
              title="Написати повідомлення"
            >
              <IconMessage size={20} />
            </ActionIcon>
          )}
        </Group>
      </Card.Section>
    </Card>
  );
}
