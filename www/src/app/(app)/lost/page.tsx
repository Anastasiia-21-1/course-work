'use client'
import {useGetLosts} from "@/api/losts";
import {Loading} from "@/components/layout/Loading";
import {useSession} from "next-auth/react";
import {LostCard} from "@/components/lost/LostCard";
import {ItemsContainer} from "@/components/layout/ItemsContainer";
import {Container} from "@/components/layout/Container";

export default function LostPage() {
    const {data, fetching} = useGetLosts()

    const { data: session, status } = useSession()

    if (fetching) {
        return <Loading/>
    }

    return (
        <Container>
            <ItemsContainer>
                {data?.losts.map((el) => {
                    return <LostCard {...el} />
                })}
            </ItemsContainer>
        </Container>
    )
}
