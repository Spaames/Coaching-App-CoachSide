'use client'; //for Chakra UI

import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import Sidebar from "./components/Sidebar";
import {Provider} from "react-redux";
import { store } from "@/app/redux/store"

export default function RootLayout(
    {
        children,
    }: {
        children: React.ReactNode
    }) {
    return (
        <html lang="en">
            <body>
            <Provider store={store}>
                <ChakraProvider theme={theme}>
                    <Sidebar />
                    {children}
                </ChakraProvider>
            </Provider>
            </body>
        </html>
    )
}