'use client'
import {useGetFinds} from "@/api/finds";
import {Loading} from "@/components/layout/Loading";
import {FindCard} from "@/components/find/FindCard";
import { AppContainer } from "@/components/layout/AppContainer";
import {ItemsContainer} from "@/components/layout/ItemsContainer";

export default function FindPage() {
    const {data: finds, isLoading, error} = useGetFinds()

    if (isLoading) {
        return <Loading/>
    }

    if (error) {
        return (
            <AppContainer title="Всі знахідки">
                <div>Error: {error?.message}</div>
            </AppContainer>
        )
    }

    return (
        <AppContainer title="Всі знахідки">
            <ItemsContainer>
                {finds?.map((el) => {
                    return <FindCard key={el.id} {...el} />
                })}
            </ItemsContainer>
        </AppContainer>
    )
}

