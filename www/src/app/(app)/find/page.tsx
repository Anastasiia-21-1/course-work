'use client'
import {useGetFinds} from "@/api/finds";
import {Loading} from "@/components/Loading";
import {FindCard} from "@/components/find/FindCard";
import { Container } from "@/components/layout/Container";
import {ItemsContainer} from "@/components/layout/ItemsContainer";

export default function FindPage() {
    const {data, fetching} = useGetFinds()

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

