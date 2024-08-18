'use client'
import {useGetFindsByUser} from "@/api/finds";
import {Loading} from "@/components/layout/Loading";
import {AppContainer} from "@/components/layout/AppContainer";
import {ItemsContainer} from "@/components/layout/ItemsContainer";
import {FindCard} from "@/components/find/FindCard";
import {useSession} from "next-auth/react";
import {useAuthGuard} from "@/utils/auth";

export default function FindPage() {
    useAuthGuard()
    const {data: session, status} = useSession()

    const {data, fetching} = useGetFindsByUser(session?.user?.id!)

    if (fetching) {
        return <Loading/>
    }

    return (
        <AppContainer title="Мої знахідки">
            <ItemsContainer>
                {data?.finds.map((el) => {
                    return <FindCard key={el.id} {...el} />
                })}
            </ItemsContainer>
        </AppContainer>
    )
}
