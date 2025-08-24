'use client'
import {useGetLosts} from "@/api/losts";
import {Loading} from "@/components/layout/Loading";
import {LostCard} from "@/components/lost/LostCard";
import { AppContainer } from "@/components/layout/AppContainer";
import {ItemsContainer} from "@/components/layout/ItemsContainer";

export default function LostPage() {
    const {data: losts, isLoading, error} = useGetLosts()

    if (isLoading) {
        return <Loading/>
    }

    if (error) {
        return (
            <AppContainer title="Всі втрати">
                <div>Error: {error?.message}</div>
            </AppContainer>
        )
    }

    return (
        <AppContainer title="Всі втрати">
            <ItemsContainer>
                {losts?.map((el) => {
                    return <LostCard key={el.id} {...el} />
                })}
            </ItemsContainer>
        </AppContainer>
    )
}
