'use client'
import {Form, FormSubmitHandler, useForm} from "react-hook-form";
import {TextInput} from "react-hook-form-mantine";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Button, Container, Group, Paper, Title} from "@mantine/core";
import {useCreateUserMutation} from "@/api/users";
import {useRouter} from "next/navigation";

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

type RegisterForm = z.infer<typeof schema>

export default function RegisterPage() {
    const mutation = useCreateUserMutation()
    const router = useRouter()

    const {control} = useForm<RegisterForm>({
        resolver: zodResolver(schema),
    })
    
    const onSubmit: FormSubmitHandler<RegisterForm> = async ({data}) => {
        try {
            await mutation.mutateAsync(data)
            router.push('/api/auth/signin')
        } catch (error) {
            console.error('Error creating user:', error);
        }
    }

    return (
        <Container size={1000}>
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <Title
                    order={4}
                    mb={5}
                >
                    Реєстрація
                </Title>
                <Form
                    control={control}
                    onSubmit={onSubmit}
                    onError={console.log}
                >
                    <TextInput
                        label="Email"
                        name="email"
                        control={control}
                        required
                    />
                    <TextInput
                        label="Пароль"
                        name="password"
                        type="password"
                        control={control}
                        required
                    />
                    <Group mt="md">
                        <Button type="submit" loading={mutation.isPending}>
                            Зареєструватися
                        </Button>
                    </Group>
                </Form>
            </Paper>
        </Container>
    )
}
