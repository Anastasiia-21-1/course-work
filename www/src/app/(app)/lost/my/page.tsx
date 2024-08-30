'use client'
import {useGetLostsByUser} from "@/api/losts";
import {Loading} from "@/components/layout/Loading";
import {useSession} from "next-auth/react";
import {LostCard} from "@/components/lost/LostCard";
import {ItemsContainer} from "@/components/layout/ItemsContainer";
import {AppContainer} from "@/components/layout/AppContainer";

export default function LostPage() {
    const {data: session, status} = useSession()

    const {data, fetching} = useGetLostsByUser(session?.user?.id!)

    if (fetching) {
        return <Loading/>
    }


    return (
        <AppContainer title="Мої загублені речі">
            <ItemsContainer>
                {data?.losts.map((el) => {
                    return <LostCard key={el.title} {...el} />
                })}
            </ItemsContainer>
        </AppContainer>
    )
}
