"use client";
import React from "react";
import Navbar from "@/app/components/Navbar";
import {ReduxProvider} from "@/app/redux/provider";
import {ChakraProvider} from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";

export default function RootLayout(
    {
        children,
    }: {
        children: React.ReactNode
    }) {

    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <title>ReMuscles</title>
            </head>
            <body>
                <ReduxProvider>
                    <ChakraProvider>
                        <Navbar />
                        <Box as="main" ml={{ base: "0", md: "180px" }} p="4">
                            {children}
                        </Box>
                    </ChakraProvider>
                </ReduxProvider>
            </body>
        </html>
    )
}