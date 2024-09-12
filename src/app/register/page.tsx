"use client";

import { useState, FormEvent } from "react";
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    Link,
    Text,
    PinInputField,
    Alert,
    AlertIcon,
    HStack, PinInput
} from "@chakra-ui/react";
import NextLink from "next/link";

export default function RegisterPage() {
    // State for form fields
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pin, setPin] = useState("");
    const [error, setError] = useState("");

    // Hardcoded PIN for dev purposes, will be in the env file
    const REQUIRED_PIN = "1234";

    // Handle form submission
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (pin !== REQUIRED_PIN) {
            setError("Invalid PIN. Please enter the correct code.");
            return;
        }

        // Clear the error and proceed with registration logic
        setError("");
        console.log("Username:", username, "Password:", password, "PIN:", pin);
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
                    <Heading>Sign Up</Heading>
                </Box>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={4}>
                        {error && (
                            <Alert status="error" mb={4}>
                                <AlertIcon />
                                {error}
                            </Alert>
                        )}
                        <FormControl id="username" isRequired>
                            <FormLabel>Username</FormLabel>
                            <Input
                                type="text"
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
                        <FormControl id="confirm-password" isRequired>
                            <FormLabel>Confirm Password</FormLabel>
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </FormControl>
                        <FormControl id="pin" isRequired>
                            <FormLabel>PIN</FormLabel>
                            <HStack>
                                <PinInput
                                    onChange={(value) => setPin(value)}
                                    value={pin}
                                    otp
                                >
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                </PinInput>
                            </HStack>
                        </FormControl>
                        <Button
                            colorScheme="teal"
                            type="submit"
                            width="full"
                        >
                            Register
                        </Button>
                    </Stack>
                </form>
                <Text mt={4} textAlign="center">
                    Already have an account?{" "}
                    <Link as={NextLink} href="/login" color="teal.500" fontWeight="bold">
                        Sign in instead
                    </Link>
                </Text>
            </Box>
        </Flex>
    );
}
