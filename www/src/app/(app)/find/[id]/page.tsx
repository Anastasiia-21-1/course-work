'use client'
import {useGetFindById} from "@/api/finds";
import { AppContainer } from "@/components/layout/AppContainer";
import {Button, Image} from "@mantine/core";

export default function Page({ params }: { params: { id: string } }) {
    const {data} = useGetFindById(params.id)
    const find = data?.finds[0]

    return (
        <AppContainer title="Знахідка">
            <div className="flex gap-5">
                <Image src={find?.photo ?? ''} alt="" className="w-80 h-96 object-cover rounded-lg"/>
                <div className="space-y-2">
                    <h1 className="text-3xl">{find?.title}</h1>
                    <p>{find?.description}</p>
                    <p>Місто - {find?.City?.name}</p>
                    <p>Місце - {find?.location}</p>
                    <p>Час - {find?.time}</p>
                    <div className="flex gap-2">
                        <Button>
                            Звязатись з людиною
                        </Button>
                        <Button>
                            Поскаржитись
                        </Button>
                    </div>
                </div>
            </div>
        </AppContainer>
    )
}
