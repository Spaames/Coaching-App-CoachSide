"use client";

import {Box, Button, Flex, FormControl, FormLabel, Heading, Input, Link, Stack, Text} from "@chakra-ui/react";
import {FormEvent, useState} from "react";
import NextLink from "next/link";

export default function Page() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        console.log("username", username, " password", password);
    };

    return (
        <Flex minHeight="100vh" align="center" justify="center" bg="gray.50">
            <Box
                p={8}
                maxWidth="400px"
                borderWidth={1}
                borderRadius={8}
                boxShadow="lg"
                bg="white"
            >
                <Box textAlign="center" mb={6}>
                    <Heading>Login</Heading>
                </Box>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={4}>
                        <FormControl id="email" isRequired>
                            <FormLabel>Username</FormLabel>
                            <Input
                                type="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </FormControl>
                        <FormControl id="password" isRequired>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormControl>
                        <Button
                            colorScheme="teal"
                            type="submit"
                            width="full"
                        >
                            Login
                        </Button>
                    </Stack>
                </form>
                <Text mt={4} textAlign="center">
                    Don't have an account?{" "}
                    <Link as={NextLink} href="/register" color="teal.500" fontWeight="bold">
                        Sign up instead
                    </Link>
                </Text>
            </Box>
        </Flex>
    )
}