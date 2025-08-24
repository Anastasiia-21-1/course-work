'use client'
import {useGetLostsByUser} from "@/api/losts";
import {Loading} from "@/components/layout/Loading";
import {LostCard} from "@/components/lost/LostCard";
import { AppContainer } from "@/components/layout/AppContainer";
import {ItemsContainer} from "@/components/layout/ItemsContainer";
import {useSession} from "next-auth/react";

export default function MyLostPage() {
    const { data: session } = useSession();
    const {data: losts, isLoading, error} = useGetLostsByUser(session?.user?.id || '')

    if (isLoading) {
        return <Loading/>
    }

    if (error) {
        return (
            <AppContainer title="Мої втрати">
                <div>Error: {error?.message}</div>
            </AppContainer>
        )
    }

    if (!session?.user?.id) {
        return (
            <AppContainer title="Мої втрати">
                <div>Будь ласка увійдіть в обліковий запис щоб переглянути свої втрачені речі</div>
            </AppContainer>
        )
    }

    return (
        <AppContainer title="Мої втрати">
            <ItemsContainer>
                {losts?.map((el) => {
                    return <LostCard key={el.id} {...el} />
                })}
            </ItemsContainer>
        </AppContainer>
    )
}
