import { Button, Card, Center, Group, Image, Text, ActionIcon } from '@mantine/core';
import { IconBuilding, IconClock, IconMap, IconMessage } from '@tabler/icons-react';
import classes from './FindCard.module.css';
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
  userId?: string | null;
  city?: {
    name?: string | null;
  } | null;
}

export function FindCard({ id, title, photo, description, location, time, city, userId }: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  interface ChatResponse {
    id: string;
  }

  const handleStartChat = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      router.push('/api/auth/signin');
      return;
    }

    if (!userId) {
      console.error('User ID is required to start a chat');
      return;
    }

    try {
      const { data: chat } = await axios.post<ChatResponse>('/api/chats', {
        findId: id,
        recipientId: userId,
      });
      router.push(`/messages/${chat.id}`);
    } catch (error) {
      console.error('Error creating chat:', error);
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
        <Image
          className="w-full h-48"
          src={
            photo ?? 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
          }
          alt={'' + title}
        />
      </Card.Section>

      <Group justify="space-between" className="line-clamp-3" mt="md" h={40}>
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
          <Link href={`/find/${id}`} style={{ flex: 1 }}>
            <Button radius="xl" fullWidth>
              Детальніше
            </Button>
          </Link>
          {userId && (
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
