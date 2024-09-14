'use client'; //for Chakra UI

import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";

export default function RootLayout(
    {
        children,
    }: {
        children: React.ReactNode
    }) {
    return (
        <html lang="en">
            <body>
                <ChakraProvider theme={theme}>
                    {children}
                </ChakraProvider>
            </body>
        </html>
    )
}