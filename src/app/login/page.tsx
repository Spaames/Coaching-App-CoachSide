"use client";

import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Link,
    Stack,
    Text,
    Alert,
    AlertIcon
} from "@chakra-ui/react";
import {FormEvent, useState} from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import { loginAPI } from "@/app/redux/features/authSlice"

export default function Page() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { error, loading, isAuthenticated} = useAppSelector((state) => state.auth)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        dispatch(loginAPI(username, password));
    };

    if (isAuthenticated) {
        router.push("/home");
    }

    return (
        <Flex minHeight="100vh" align="center" justify="center">
            <Box
                p={8}
                maxWidth="400px"
                borderWidth={1}
                borderRadius={8}
                boxShadow="lg"
            >
                <Box textAlign="center" mb={6}>
                    <Heading>Login</Heading>
                </Box>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={4}>
                        {error && (
                            <Alert status="error" mb={4}>
                                <AlertIcon />
                                {error}
                            </Alert>
                        )}
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
                            isLoading={loading}
                        >
                            Login
                        </Button>
                    </Stack>
                </form>
                <Text mt={4} textAlign="center">
                    Dont have an account?{" "}
                    <Link as={NextLink} href="/register" color="teal.500" fontWeight="bold">
                        Sign up instead
                    </Link>
                </Text>
            </Box>
        </Flex>
    )
}