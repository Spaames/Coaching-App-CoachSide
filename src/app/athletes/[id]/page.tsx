'use client';

import React, { useState } from 'react';
import {
    Tabs,
    TabList,
    Tab,
    TabPanel,
    TabPanels,
    Button,
    VStack,
    Box, HStack, Heading, NumberInput, NumberInputField
} from "@chakra-ui/react";
import Block from "@/app/components/block/Block";

export default function Page({ params }: { params: { id: string } }) {
    const athlete = params.id;
    const [sessions, setSessions] = useState<number[]>([]);

    // Fonction pour ajouter un nouveau bloc
    const addSession = () => {
        setSessions([...sessions, sessions.length + 1]);  // Ajoute un nouveau bloc avec un ID unique
    };

    // Fonction pour supprimer le dernier bloc
    const removeSession = () => {
        setSessions(sessions.slice(0, -1));  // Supprime le dernier bloc
    };

    return (
        <Tabs isFitted variant='soft-rounded' colorScheme='green'>
            <TabList>
                <Tab>Blocks</Tab>
                <Tab>Data</Tab>
                <Tab>Details</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <VStack spacing={4} align="stretch" marginTop={5}>
                        <Heading marginBottom={4} as="h4" size="md">
                            <HStack spacing={4}>
                                <span>Week</span>
                                <NumberInput min={1} max={52} maxW={20}>
                                    <NumberInputField/>
                                </NumberInput>
                                <span>To</span>
                                <NumberInput min={1} max={52} maxW={20}>
                                    <NumberInputField/>
                                </NumberInput>
                            </HStack>
                        </Heading>
                        <Box>
                            <Button colorScheme="teal" onClick={addSession} mr={2}>Add Session</Button>
                            <Button colorScheme="red" onClick={removeSession} isDisabled={sessions.length === 0}>Remove Session</Button>
                        </Box>
                        {sessions.map((sessionId) => (
                            <Block key={sessionId} athletes={athlete} />
                        ))}
                    </VStack>
                </TabPanel>
                <TabPanel>
                    <p>two!</p>
                </TabPanel>
                <TabPanel>
                    <p>three!</p>
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
}
