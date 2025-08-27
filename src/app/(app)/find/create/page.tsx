'use client';
import { Form, FormSubmitHandler, useForm } from 'react-hook-form';
import { useGetCategories } from '@/api/categories';
import { Select, TextInput } from 'react-hook-form-mantine';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Button,
  Container,
  Group,
  Paper,
  Title,
  Image,
  FileInput,
  Loader,
  Text,
} from '@mantine/core';
import { useInsertFind } from '@/api/finds';
import { useGetCities } from '@/api/cities';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { uploadFileToBlob } from '@/lib/upload';

const schema = z.object({
  title: z.string(),
  description: z.string().optional(),
  category: z.string(),
  city: z.string(),
  location: z.string().optional(),
  time: z.string().optional(),
  photo: z.string().optional(),
});

type CreateFindForm = z.infer<typeof schema>;

export default function CreateFindPage() {
  const { data: session } = useSession();
  const { data: categories } = useGetCategories();
  const { data: cities } = useGetCities();
  const mutation = useInsertFind();
  const router = useRouter();

  const { control, setValue, watch } = useForm<CreateFindForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      city: '',
      location: '',
      time: '',
      photo: '',
    },
  });

  const photoUrl = watch('photo');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onSubmit: FormSubmitHandler<CreateFindForm> = async ({ data }) => {
    if (!session?.user?.id) {
      console.error('User not authenticated');
      return;
    }

    try {
      await mutation.mutateAsync({
        title: data.title,
        description: data.description || undefined,
        location: data.location || undefined,
        photo: data.photo || undefined,
        category_id: +data.category,
        city_id: +data.city,
        user_id: session.user.id,
      });
      router.push('/find');
    } catch (error) {
      console.error('Error creating find item:', error);
    }
  };

  if (!session?.user?.id) {
    return (
      <Container size={1000}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Title order={4} mb={5}>
            Додати знахідку
          </Title>
          <div>Будь ласка увійдіть в обліковий запис щоб додати знахідку</div>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size={1000}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Title order={4} mb={5}>
          Додати знахідку
        </Title>
        <Form control={control} onSubmit={onSubmit} onError={console.log}>
          <TextInput label="Назва" name="title" control={control} required />
          <TextInput label="Опис" name="description" control={control} />
          <Select
            required
            name="city"
            control={control}
            label="Місто"
            placeholder="Оберіть місто"
            data={cities?.map((city) => ({
              value: city.id.toString(),
              label: city.name,
            }))}
          />
          <Select
            required
            name="category"
            control={control}
            label="Категорія"
            placeholder="Оберіть категорію"
            data={categories?.map((category) => ({
              value: category.id.toString(),
              label: category.name,
            }))}
          />
          <div style={{ marginTop: 12 }}>
            <FileInput
              label="Фото"
              placeholder="Оберіть файл"
              onChange={async (file) => {
                if (!file) return;
                setUploadError(null);
                setUploading(true);
                try {
                  const url = await uploadFileToBlob(file);
                  setValue('photo', url, { shouldValidate: true, shouldDirty: true });
                } catch (e: any) {
                  setUploadError(e?.message || 'Помилка завантаження');
                } finally {
                  setUploading(false);
                }
              }}
              accept="image/*"
            />
            {uploading && (
              <Group gap="xs" mt={6}>
                <Loader size="sm" />
                <Text size="sm">Завантаження...</Text>
              </Group>
            )}
            {uploadError && (
              <Text size="sm" c="red" mt={6}>
                {uploadError}
              </Text>
            )}
            {photoUrl && (
              <img src={photoUrl} alt="Preview" className="mt-8 h-40 w-full object-cover" />
            )}
          </div>
          <TextInput label="Місце" name="location" control={control} />
          <TextInput label="Час" name="time" control={control} />
          <Group mt="md">
            <Button
              type="submit"
              loading={mutation.isPending}
              disabled={mutation.isPending || uploading || uploadError !== null}
            >
              Опублікувати
            </Button>
          </Group>
        </Form>
      </Paper>
    </Container>
  );
}
