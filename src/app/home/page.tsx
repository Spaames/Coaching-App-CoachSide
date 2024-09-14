'use client'
import { Button, Flex, Box, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import {useAppDispatch} from "@/app/redux/hooks";
import {logout} from "@/app/redux/features/authSlice";

export default function Page() {
    const router = useRouter();
    const dispatch = useAppDispatch()

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/logout", {
                method: "GET",
            });

            if (response.ok) {
                dispatch(logout());
                router.push("/login");
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <Flex minHeight="100vh" align="center" justify="center" bg="gray.50">
            <Box p={8} maxWidth="400px" borderWidth={1} borderRadius={8} boxShadow="lg" bg="white">
                <Text>Welcome to the home page!</Text>
                <Button colorScheme="red" onClick={handleLogout}>
                    Logout
                </Button>
            </Box>
        </Flex>
    );
}
