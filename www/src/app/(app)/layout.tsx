import { Header } from "@/components/Header";
import {PropsWithChildren} from "react";

export default function AppLayout({children}: PropsWithChildren) {
    return (
        <>
            <Header/>
            {children}
        </>
    )
}
