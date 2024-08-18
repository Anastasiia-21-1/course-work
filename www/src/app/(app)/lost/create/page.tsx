'use client'
import {Form, FormSubmitHandler, useForm} from "react-hook-form";
import {useGetCategories} from "@/api/categories";
import {Select, TextInput} from "react-hook-form-mantine";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Button, Container, Group, Paper, Title} from "@mantine/core";
import {useInsertLost} from "@/api/losts";
import {useGetCities} from "@/api/cities";
import {useRouter} from "next/navigation";
import {useAuthGuard} from "@/utils/auth";

const schema = z.object({
    title: z.string(),
    description: z.string().nullable().optional(),
    category: z.string(),
    city: z.string(),
    location: z.string().nullable().optional(),
    time: z.string().nullable().optional(),
    photo: z.string().nullable().optional(),
});

type CreateLostForm = z.infer<typeof schema>

export default function CreateLostPage() {
    useAuthGuard()
    const {data: categories} = useGetCategories()
    const {data: cities} = useGetCities()
    const mutation = useInsertLost()
    const router = useRouter()

    const {control} = useForm<CreateLostForm>({
        resolver: zodResolver(schema),
    })
    const onSubmit: FormSubmitHandler<CreateLostForm> = async ({data}) => {
        const result = await mutation({
            title: data.title,
            description: data.description,
            location: data.location,
            photo: data.photo,
            category_id: +data.category,
            city_id: +data.city,
        })
        router.push('/Lost')
    }

    return (
        <Container size={1000}>
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <Title
                    order={4}
                    mb={5}
                >
                    Додати втрату
                </Title>
                <Form
                    control={control}
                    onSubmit={onSubmit}
                    onError={console.log}
                >
                    <TextInput
                        label="Назва"
                        name="title"
                        control={control}
                        required
                    />
                    <TextInput
                        label="Опис"
                        name="description"
                        control={control}
                    />
                    <Select
                        required
                        name="city"
                        control={control}
                        label="Місто"
                        placeholder="Оберіть місто"
                        data={
                            cities?.City.map((city) => ({
                                value: city.id.toString(),
                                label: city.name
                            }))
                        }
                    />
                    <Select
                        required
                        name="category"
                        control={control}
                        label="Категорія"
                        placeholder="Оберіть категорію"
                        data={
                            categories?.category.map((category) => ({
                                value: category.id.toString(),
                                label: category.name
                            }))
                        }
                    />
                    <TextInput
                        label="Фото"
                        name="photo"
                        control={control}
                    />
                    <TextInput
                        label="Місце"
                        name="location"
                        control={control}
                    />
                    <TextInput
                        label="Час"
                        name="time"
                        control={control}
                    />
                    <Group mt="md">
                        <Button type="submit">
                            Опублікувати
                        </Button>
                    </Group>
                </Form>
            </Paper>
        </Container>
    )
}
