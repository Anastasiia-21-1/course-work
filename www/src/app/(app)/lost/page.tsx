'use client'
import {useGetLosts} from "@/api/losts";
import {Loading} from "@/components/layout/Loading";
import {useSession} from "next-auth/react";
import {LostCard} from "@/components/lost/LostCard";
import {ItemsContainer} from "@/components/layout/ItemsContainer";
import {AppContainer} from "@/components/layout/AppContainer";
import {authGuard} from "@/utils/auth";

export default function LostPage() {
    authGuard()
    const {data, fetching} = useGetLosts()

    const { data: session, status } = useSession()

    if (fetching) {
        return <Loading/>
    }

    return (
        <AppContainer title="Всі загублені речі">
            <ItemsContainer>
                {data?.losts.map((el) => {
                    return <LostCard key={el.title} {...el} />
                })}
            </ItemsContainer>
        </AppContainer>
    )
}
