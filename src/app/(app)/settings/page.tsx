'use client';
import { Button, Container, Group, Paper, Title } from '@mantine/core';
import { Form, FormSubmitHandler, useForm } from 'react-hook-form';
import { TextInput } from 'react-hook-form-mantine';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGetUserById, useUpdateUserMutation } from '@/api/users';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { notifications } from '@mantine/notifications';

const schema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  image: z.string(),
});

type UpdateProfileForm = z.infer<typeof schema>;

export default function SettingsPage() {
  const { data: session } = useSession();

  const { control, reset } = useForm<UpdateProfileForm>({
    resolver: zodResolver(schema),
  });

  const mutation = useUpdateUserMutation();

  const { data: profile } = useGetUserById(session?.user?.id || '');

  useEffect(() => {
    if (profile) {
      reset({
        first_name: profile?.first_name || '',
        last_name: profile?.last_name || '',
        email: profile?.email || '',
        image: profile?.image || '',
      });
    }
  }, [profile, reset]);

  const onSubmit: FormSubmitHandler<UpdateProfileForm> = async ({ data }) => {
    if (!session?.user?.id) {
      notifications.show({
        title: 'Помилка',
        message: 'Користувач не авторизований',
        color: 'red',
      });
      return;
    }

    try {
      await mutation.mutateAsync({
        id: session.user.id,
        first_name: data?.first_name,
        last_name: data?.last_name,
        email: data?.email,
        image: data?.image,
      });

      notifications.show({
        title: 'Успіх',
        message: 'Профіль оновлено успішно',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Помилка',
        message: error instanceof Error ? error.message : 'Помилка оновлення профілю',
        color: 'red',
      });
    }
  };

  if (!session?.user?.id) {
    return (
      <Container size={1000}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Title order={4} mb={5}>
            Профіль
          </Title>
          <div>Будь ласка увійдіть в обліковий запис щоб переглянути профіль</div>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size={1000}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Title order={4} mb={5}>
          Профіль
        </Title>
        <Form control={control} onSubmit={onSubmit} onError={console.log}>
          <TextInput label="Ім'я" name="first_name" control={control} />
          <TextInput label="Прізвище" name="last_name" control={control} />
          <TextInput label="Електронна пошта" name="email" control={control} />
          <TextInput label="Аватар" name="image" control={control} />
          <Group mt="md">
            <Button type="submit" loading={mutation.isPending}>
              Зберегти
            </Button>
          </Group>
        </Form>
      </Paper>
    </Container>
  );
}
