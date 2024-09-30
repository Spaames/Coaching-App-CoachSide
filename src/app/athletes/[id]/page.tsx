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
    Box
} from "@chakra-ui/react";
import Block from "@/app/components/Block";

export default function Page({ params }: { params: { id: string } }) {
    const athlete = params.id;
    const [blocks, setBlocks] = useState<number[]>([]);

    // Fonction pour ajouter un nouveau bloc
    const addBlock = () => {
        setBlocks([...blocks, blocks.length + 1]);  // Ajoute un nouveau bloc avec un ID unique
    };

    // Fonction pour supprimer le dernier bloc
    const removeBlock = () => {
        setBlocks(blocks.slice(0, -1));  // Supprime le dernier bloc
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
                    <VStack spacing={4} align="stretch">
                        <Box>
                            <Button colorScheme="teal" onClick={addBlock} mr={2}>Add Block</Button>
                            <Button colorScheme="red" onClick={removeBlock} isDisabled={blocks.length === 0}>Remove Block</Button>
                        </Box>
                        {blocks.map((blockId) => (
                            <Block key={blockId} athletes={athlete} />
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
