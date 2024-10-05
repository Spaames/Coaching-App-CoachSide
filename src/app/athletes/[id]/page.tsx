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
    Box, HStack, Heading, NumberInput, NumberInputField, Select, Stack
} from "@chakra-ui/react";
import Session from "@/app/components/block/Session";

export default function Page({ params }: { params: { id: string } }) {
    const athlete = params.id;
    const [sessions, setSessions] = useState<{id: number, day:string, week:number}[]>([]);
    const [weekRange, setWeekRange] = useState<{from: number, to: number}>({from: 0, to: 0});
    const [selectedDay, setSelectedDay] = useState<string>("");

    const getNumberOfWeeks = () => (weekRange.to - weekRange.from) + 1;

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDay(event.target.value);
    }

    const addSession = (day: string) => {
        const weeks = getNumberOfWeeks();
        const newSession = [];
        for (let i = 0; i < weeks; i++) {
            newSession.push({
                id: sessions.length + 1,
                day,
                week: weekRange.from + i,
            });
        }
        setSessions([...sessions, ...newSession]);
    };

    const removeSession = () => {
        const weeks = getNumberOfWeeks();
        const newSession = sessions.slice(0, -weeks);
        setSessions(newSession);
    };

    return (
        <Tabs isFitted variant='soft-rounded' colorScheme='green'>
            <TabList>
                <Tab>Blocks</Tab>
                <Tab>Create Blocks</Tab>
                <Tab>Data</Tab>
                <Tab>Details</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    one !
                </TabPanel>
                <TabPanel>
                    <VStack spacing={4} align="stretch" marginTop={5}>
                        <Heading marginBottom={4} as="h4" size="md">
                            <HStack spacing={4}>
                                <span>Week</span>
                                <NumberInput min={1} max={52} maxW={20} value={weekRange.from} onChange={(value) => setWeekRange({ ...weekRange, from: parseInt(value) })}>
                                    <NumberInputField/>
                                </NumberInput>
                                <span>To</span>
                                <NumberInput min={1} max={52} maxW={20} value={weekRange.to} onChange={(value) => setWeekRange({ ...weekRange, to: parseInt(value) })}>
                                    <NumberInputField/>
                                </NumberInput>
                            </HStack>
                        </Heading>
                        <Box>
                            <HStack spacing={4} marginTop={5} marginBottom={50}>
                                <Stack spacing={4}>
                                    <Select variant="filled" onChange={handleSelectChange} whiteSpace="nowrap"
                                            minWidth="auto">
                                        <option key="0" value="Nan">--Select a day--</option>
                                        <option key="1" value="Monday">Monday</option>
                                        <option key="2" value="Tuesday">Tuesday</option>
                                        <option key="3" value="Wednesday">Wednesday</option>
                                        <option key="4" value="Thursday">Thursday</option>
                                        <option key="5" value="Friday">Friday</option>
                                        <option key="6" value="Saturday">Saturday</option>
                                        <option key="7" value="Sunday">Sunday</option>
                                    </Select>
                                </Stack>
                                <Button colorScheme="teal" onClick={() => addSession(selectedDay)} mr={2}>Add Training Day</Button>
                                <Button colorScheme="red" onClick={() => removeSession()} isDisabled={sessions.length === 0}>Remove Last Day</Button>
                            </HStack>
                        </Box>
                        {sessions.map((session, index) => (
                            <Session key={index} sessionId={session.id} athletes={athlete} day={session.day} week={session.week} />
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
