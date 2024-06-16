'use client'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {ReactNode} from "react";
import {client} from "@/utils/client"
import {Provider} from "urql";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider value={client}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
