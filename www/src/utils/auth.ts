import {useSession} from "next-auth/react";
import {redirect} from "next/navigation";

export const authGuard = () => {
    const {data: session, status} = useSession()
    if (status === 'unauthenticated' && !session) {
        redirect('/api/auth/signin')
    }
}
