'use client'
import {Button, Container, Group, Paper, Title} from "@mantine/core";
import {Form, FormSubmitHandler, useForm} from "react-hook-form";
import {TextInput} from "react-hook-form-mantine";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {getUserByIdRequest, useUpdateUser} from "@/api/users";
import {useSession} from "next-auth/react";
import {useEffect} from "react";
import {notifications} from "@mantine/notifications";
import {useAuthGuard} from "@/utils/auth";

const schema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
    image: z.string(),
});

type UpdateProfileForm = z.infer<typeof schema>

export default function SettingsPage() {
    useAuthGuard()
    const {data: session} = useSession()

    const {control, reset} = useForm<UpdateProfileForm>({
        resolver: zodResolver(schema),
    });

    const mutation = useUpdateUser()

    useEffect(() => {
        if (!session?.user?.id) {
            return
        }
        getUserByIdRequest(session.user.id)
            .then(({data}) => {
                const profile = data?.users_by_pk;
                reset({
                    first_name: profile?.first_name,
                    last_name: profile?.last_name,
                    email: profile?.email,
                    image: profile?.image,
                });
            });
    }, [session?.user?.id, reset]);

    const onSubmit: FormSubmitHandler<UpdateProfileForm> = async ({data}) => {
        const result = await mutation({
            userId: session?.user?.id!,
            firstName: data?.first_name,
            lastName: data?.last_name,
            email: data?.email,
            image: data?.image,
        })
        if (result.error) {
            notifications.show({
                title: 'Помилка',
                message: result?.error?.message,
                color: 'red'
            })
        } else {
            notifications.show({
                title: 'Успіх',
                message: ''
            })
        }
    }

    return (
        <Container size={1000}>
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <Title
                    order={4}
                    mb={5}
                >
                    Профіль
                </Title>
                <Form
                    control={control}
                    onSubmit={onSubmit}
                    onError={console.log}
                >
                    <TextInput
                        label="Назва"
                        name="first_name"
                        control={control}
                    />
                    <TextInput
                        label="Опис"
                        name="last_name"
                        control={control}
                    />
                    <TextInput
                        label="Електронна пошта"
                        name="email"
                        control={control}
                    />
                    <TextInput
                        label="Аватар"
                        name="image"
                        control={control}
                    />
                    <Group mt="md">
                        <Button type="submit">
                            Зберегти
                        </Button>
                    </Group>
                </Form>
            </Paper>
        </Container>
    )
}
