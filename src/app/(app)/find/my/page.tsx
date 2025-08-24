'use client'
import {useGetFindsByUser} from "@/api/finds";
import {Loading} from "@/components/layout/Loading";
import {FindCard} from "@/components/find/FindCard";
import { AppContainer } from "@/components/layout/AppContainer";
import {ItemsContainer} from "@/components/layout/ItemsContainer";
import {useSession} from "next-auth/react";

export default function MyFindPage() {
    const { data: session } = useSession();
    const {data: finds, isLoading, error} = useGetFindsByUser(session?.user?.id || '')

    if (isLoading) {
        return <Loading/>
    }

    if (error) {
        return (
            <AppContainer title="Мої знахідки">
                <div>Error: {error?.message}</div>
            </AppContainer>
        )
    }

    if (!session?.user?.id) {
        return (
            <AppContainer title="Мої знахідки">
                <div>Будь ласка увійдіть в обліковий запис щоб переглянути свої знахідки</div>
            </AppContainer>
        )
    }

    return (
        <AppContainer title="Мої знахідки">
            <ItemsContainer>
                {finds?.map((el) => {
                    return <FindCard key={el.id} {...el} />
                })}
            </ItemsContainer>
        </AppContainer>
    )
}
