'use client'
import {useGetLosts} from "@/api/losts";
import {Loading} from "@/components/Loading";
import {useSession} from "next-auth/react";

export default function LostPage() {
    const {data, fetching} = useGetLosts()

    const { data: session, status } = useSession()

    if (fetching) {
        return <Loading/>
    }

    return (
        <div>
            {JSON.stringify(session, null, 2)}
            {JSON.stringify(data, null, 2)}
        </div>
    )
}
