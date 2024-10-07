'use client';

import React, {useRef, useState} from 'react';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    Heading,
    HStack,
    Input,
    NumberInput,
    NumberInputField,
    Select,
    Stack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    VStack,
} from "@chakra-ui/react";
import Session from "@/app/components/block/Session";

interface Exercise {
    type?: string;
    name?: string;
    sets?: number;
    reps?: number;
    rpe?: string;
    percentage?: number;
    rir?: number;
    tst?: string;
    load?: number;
    rest?: string;
    instructions?: string;
    day: number;
    week: number;
    order: number;
    blockName?: string;
    athlete?: string;
}

interface Block {
    name: string;
    start: string;
    end: string;
    athlete: string;
}

export default function Page({ params }: { params: { id: string } }) {
    const athlete = params.id;
    const [blockName, setBlockName] = useState<string>("");
    const [sessions, setSessions] = useState<{id: number, day:number, week:number}[]>([]);
    const [weekRange, setWeekRange] = useState<{from: number, to: number}>({from: 0, to: 0});
    const [selectedDay, setSelectedDay] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const cancelRef = useRef<HTMLButtonElement>(null);

    const onClose = () => setIsOpen(false);

    const handlePopUp = () => {
        setIsOpen(true);
    };

    function handleCreationExercises(): Exercise[] {
        onClose();

        const exercises: Exercise[] = [];
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach((input) => {
            if (input instanceof HTMLInputElement || input instanceof HTMLSelectElement) {
                const {id} = input;
                const value = input.value;
                const [header, order, day, week] = id.split('-');
                if (header === "none" || !header) {
                    const vide: Exercise[] = [];
                    return vide;
                }

                const exercise: Exercise = {
                    order: parseInt(order),
                    day: parseInt(day),
                    week: parseInt(week),
                    athlete: athlete,
                };

                switch (header) {
                    case "type":
                        exercise.type = value;
                        break;
                    case "exercise":
                        exercise.name = value;
                        break;
                    case "sets":
                        exercise.sets = parseInt(value);
                        break;
                    case "reps":
                        exercise.reps = parseInt(value);
                        break;
                    case "rpe":
                        exercise.rpe = value;
                        break;
                    case "%1rm":
                        exercise.percentage = parseInt(value);
                        break;
                    case "rir":
                        exercise.rir = parseInt(value);
                        break;
                    case "tst":
                        exercise.tst = value;
                        break;
                    case "load":
                        exercise.load = parseInt(value);
                        break;
                    case "rest":
                        exercise.rest = value;
                        break;
                    case "instructions":
                        exercise.instructions = value;
                        break;
                    default:
                        break;
                }

                const existingExerciseIndex = exercises.findIndex((ex) =>
                    ex.day === exercise.day && ex.week === exercise.week && ex.order === exercise.order
                );

                if (existingExerciseIndex != -1) {
                    exercises[existingExerciseIndex] = {
                        ...exercises[existingExerciseIndex],
                        ...exercise,
                    };
                } else {
                    exercise.blockName = blockName;
                    exercises.push(exercise);
                }
            }
        });
        exercises.shift();
        return exercises;
    }


    const handleSaveExercises = async (dataExercises: Exercise[]) => {
        try {
            const response = await fetch("/api/saveExercises", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataExercises),
            });

            const data = await response.json();
            if (response.status === 200) {
                console.log("Exercises created");
            } else {
                console.log(data.message);
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleSaveBlock = async (dataExercises: Exercise[]) => {
        const currentYear = new Date().getFullYear();
        const weeks = dataExercises.map(exercise => exercise.week);
        const start = Math.min(...weeks) + "-" + currentYear;
        const end = Math.max(...weeks) + "-" + currentYear;
        const block: Block = {
            name: blockName,
            start: start,
            end: end,
            athlete: athlete,
        }
        try {
            const response = await fetch("/api/saveBlock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(block),
            });

            const data = await response.json();
            if (response.status === 200) {
                console.log("block saved");
            } else {
                console.log(data.message);
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleSave = async () => {
        const data = handleCreationExercises();
        await handleSaveExercises(data);
        await handleSaveBlock(data);
    }


    const getNumberOfWeeks = () => (weekRange.to - weekRange.from) + 1;

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDay(event.target.value);
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBlockName(event.target.value);
    }

    const addSession = (day: number) => {
        const weeks = getNumberOfWeeks();
        const newSession = [];
        for (let i = 0; i < weeks; i++) {
            newSession.push({
                id: sessions.length + 1,
                day: day,
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
                                <span>Name</span>
                                <Input id="titleBlock" maxW={60} variant='outline' placeholder="Block's name" onChange={handleNameChange} />
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
                                        <option key="1" value="1">Monday</option>
                                        <option key="2" value="2">Tuesday</option>
                                        <option key="3" value="3">Wednesday</option>
                                        <option key="4" value="4">Thursday</option>
                                        <option key="5" value="5">Friday</option>
                                        <option key="6" value="6">Saturday</option>
                                        <option key="7" value="7">Sunday</option>
                                    </Select>
                                </Stack>
                                <Button colorScheme="teal" onClick={() => addSession(parseInt(selectedDay))} mr={2}>Add Training Day</Button>
                                <Button colorScheme="red" onClick={() => removeSession()} isDisabled={sessions.length === 0}>Remove Last Day</Button>
                            </HStack>
                        </Box>
                        {sessions.map((session, index) => (
                            <Session key={index} sessionId={session.id} athletes={athlete} day={session.day} week={session.week} />
                        ))}
                        <Button colorScheme="teal" onClick={handlePopUp}>Create Block</Button>
                        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
                            <AlertDialogOverlay>
                                <AlertDialogContent>
                                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                        Confirmation
                                    </AlertDialogHeader>

                                    <AlertDialogBody>
                                        Are you sure you want to create this block?
                                    </AlertDialogBody>

                                    <AlertDialogFooter>
                                        <Button colorScheme="red" ref={cancelRef} onClick={onClose}>
                                            No
                                        </Button>
                                        <Button colorScheme="teal" onClick={handleSave} ml={3}>
                                            Yes
                                        </Button>
                                    </AlertDialogFooter>

                                </AlertDialogContent>
                            </AlertDialogOverlay>
                        </AlertDialog>
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
