'use client'
import {useGetLosts} from "@/api/losts";
import {Loading} from "@/compents/Loading";

export default function LostPage() {
    const {data, fetching} = useGetLosts()

    if (fetching) {
        return Loading
    }

    return (
        <div>
            {JSON.stringify(data, null, 2)}
        </div>
    )
}
