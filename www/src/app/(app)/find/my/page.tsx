'use client'
import {useGetFinds} from "@/api/finds";
import {Loading} from "@/components/Loading";

export default function FindPage() {
    const {data, fetching} = useGetFinds()

    if (fetching) {
        return <Loading/>
    }

    return (
        <div>
            {JSON.stringify(data, null, 2)}
        </div>
    )
}

