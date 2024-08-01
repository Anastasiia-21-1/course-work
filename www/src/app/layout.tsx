'use client'
import '@mantine/core/styles.css';
import {Inter} from "next/font/google";
import "@/style/globals.css";
import {PropsWithChildren} from "react";
import {client} from "@/utils/client"
import {Provider} from "urql";
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import {SessionProvider} from "next-auth/react";

const inter = Inter({subsets: ["latin"]});

export default function RootLayout({children}: PropsWithChildren) {
    return (
        <html lang="en">
        <head>
            <title></title>
            <ColorSchemeScript/>
        </head>
        <body className={inter.className}>
        <Provider value={client}>
            <MantineProvider>
                <SessionProvider>
                    {children}
                </SessionProvider>
            </MantineProvider>
        </Provider>
        </body>
        </html>
    );
}
