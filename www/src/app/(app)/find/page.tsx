'use client'
import {useGetFinds} from "@/api/finds";
import {Loading} from "@/components/layout/Loading";
import {FindCard} from "@/components/find/FindCard";
import { AppContainer } from "@/components/layout/AppContainer";
import {ItemsContainer} from "@/components/layout/ItemsContainer";

export default function FindPage() {
    const {data, fetching} = useGetFinds()

    if (fetching) {
        return <Loading/>
    }

    return (
        <AppContainer title="Всі знахідки">
            <ItemsContainer>
                {data?.finds.map((el) => {
                    return <FindCard key={el.id} {...el} />
                })}
            </ItemsContainer>
        </AppContainer>
    )
}

