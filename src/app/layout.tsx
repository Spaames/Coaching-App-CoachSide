"use client";
import React from "react";
import Navbar from "@/app/components/Navbar";
import {ReduxProvider} from "@/app/redux/provider";
import {ChakraProvider} from "@chakra-ui/react";

export default function RootLayout(
    {
        children,
    }: {
        children: React.ReactNode
    }) {

    return (
        <html lang="en">
            <body>
                <ReduxProvider>
                    <ChakraProvider>
                        <Navbar />
                        {children}
                    </ChakraProvider>
                </ReduxProvider>
            </body>
        </html>
    )
}