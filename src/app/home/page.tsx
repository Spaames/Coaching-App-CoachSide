'use client'
import { Button, Flex, Box, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/logout", {
                method: "GET",
            });

            if (response.ok) {
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
