'use client'
import {useGetFindsByUser} from "@/api/finds";
import {Loading} from "@/components/layout/Loading";
import {Container} from "@/components/layout/Container";
import {ItemsContainer} from "@/components/layout/ItemsContainer";
import {FindCard} from "@/components/find/FindCard";
import {useSession} from "next-auth/react";

export default function FindPage() {
    const {data: session, status} = useSession()

    const {data, fetching} = useGetFindsByUser(session?.user?.id!)

    if (fetching) {
        return <Loading/>
    }

    return (
        <Container>
            <ItemsContainer>
                {data?.finds.map((el) => {
                    return <FindCard {...el} />
                })}
            </ItemsContainer>
        </Container>
    )
}
