"use client"

import { useState } from 'react';
import {useAppDispatch, useAppSelector} from "@/app/redux/hooks";
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Box,
    Heading,
    Button,
    Input,
    VStack,
    Select,
    Tabs,
    TabList,
    Tab,
    TabPanels, TabPanel
} from "@chakra-ui/react";
import {Block, deleteBlockThunk, Exercise, updateBlockThunk} from "@/app/redux/features/blockSlice";
import data from "@/lib/data.json"
import BlockDetails from "@/app/components/BlockDetails";
import {useRouter} from "next/navigation";


export default function Page({ params }: { params: { id: string } }) {
    const block = useAppSelector((state) => state.block.blocks.find(block => block.id === params.id));
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    const [editedBlock, setEditedBlock] = useState<Block>(block || {
        id: "",
        name: "",
        start: "",
        end: "",
        athlete: "",
        exercises: []
    });

    const exerciseType = data.exerciseType;
    const muscles = data.muscles;

    const dispatch = useAppDispatch();

    const handleEdit = () => {
        setIsEditing(!isEditing);
    }

    const handleSave = () => {
        if (editedBlock) {
            dispatch(updateBlockThunk(editedBlock));
            setIsEditing(false);
        }
    }

    const handleDeleteBlock = () => {
        if (block) {
            dispatch(deleteBlockThunk(block.id!));
            setIsEditing(false);
            router.push('/home')
        }
    };


    const handleInputChange = <K extends keyof Exercise>(
        e: React.ChangeEvent<HTMLInputElement>,
        exerciseIndex: number,
        field: K
    ) => {
        const newExercises = [...editedBlock.exercises];
        const updatedExercise = { ...newExercises[exerciseIndex] };

        if (field === "sets" || field === "indicatedReps" || field === "indicatedLoad") {
            updatedExercise[field] = parseInt(e.target.value, 10) as Exercise[K];
        } else {
            updatedExercise[field] = e.target.value as Exercise[K];
        }

        newExercises[exerciseIndex] = updatedExercise;
        setEditedBlock({ ...editedBlock, exercises: newExercises });
    };

    const handleSelectChange = <K extends keyof Exercise>(
        e: React.ChangeEvent<HTMLSelectElement>,
        exerciseIndex: number,
        field: K
    ) => {
        const newExercises = [...editedBlock.exercises];
        const updatedExercise = { ...newExercises[exerciseIndex] };

        updatedExercise[field] = e.target.value as Exercise[K];
        newExercises[exerciseIndex] = updatedExercise;

        setEditedBlock({ ...editedBlock, exercises: newExercises });
    };

    const handleAddExercise = (week: number, day: number) => {
        const newExercise: Exercise = {
            name: '',
            type: exerciseType[0],
            sets: 0,
            indicatedReps: "",
            indicatedLoad: "",
            primaryMuscle: muscles[0],
            secondaryMuscle: muscles[0],
            intensity: { type: 'RPE', value: 0 },
            realPerf: null,
            rest: '',
            instructions: '',
            week,
            day,
            order: editedBlock.exercises.length + 1  // Positionner le nouvel exercice à la fin
        };

        setEditedBlock({
            ...editedBlock,
            exercises: [...editedBlock.exercises, newExercise]
        });
    };

    const handleDeleteExercise = (exerciseIndex: number) => {
        const newExercises = editedBlock.exercises.filter((_, index) => index !== exerciseIndex);
        setEditedBlock({ ...editedBlock, exercises: newExercises });
    };

    if (!block) {
        return <p>Block not found</p>;
    }

    const weeks = Array.from(new Set((isEditing ? editedBlock : block).exercises.map(ex => ex.week))).sort((a, b) => a - b);

    const startWeek = weeks[0];
    const endWeek = weeks[weeks.length - 1];

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    return (
        <Tabs isFitted variant='soft-rounded' colorScheme='green'>
            <TabList>
                <Tab>Block</Tab>
                <Tab>Details</Tab>
                <Tab>Athletes Data</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <Box>
                        <Heading size="lg" mb={4}>
                            {(isEditing ? editedBlock : block).name} - {(isEditing ? editedBlock : block).athlete} (Weeks {startWeek} to {endWeek})
                        </Heading>
                        <Button onClick={handleEdit} colorScheme="blue" mb={4}>
                            {isEditing ? "Cancel" : "Modify"}
                        </Button>

                        {isEditing && (
                            <Button onClick={handleSave} colorScheme="green" mb={4} ml={4}>
                                Submit
                            </Button>
                        )}

                        {isEditing && (
                            <Button onClick={handleDeleteBlock} colorScheme={"red"} mb={4} ml={4}>Delete Block</Button>
                        )}

                        <VStack spacing={8}>
                            {weeks.map((week, index) => (
                                <Box key={week} w="100%">
                                    <Heading size="md" mb={4}>Week {index + 1}</Heading>

                                    {Array.from({ length: 7 }, (_, dayIndex) => {
                                        const dayExercises = (isEditing ? editedBlock : block).exercises
                                            .filter(ex => ex.week === week && ex.day === dayIndex + 1)
                                            .sort((a, b) => a.order - b.order);

                                        if (dayExercises.length === 0 && !isEditing) return null;

                                        return (
                                            <Box key={dayIndex}>
                                                <Heading size="sm" mb={4}>{daysOfWeek[dayIndex]}</Heading>
                                                <TableContainer key={dayIndex} w="100%" mb={8}>
                                                    <Table variant="simple" size="sm">
                                                        <Thead>
                                                            <Tr>
                                                                <Th>Type</Th>
                                                                <Th>Exercise</Th>
                                                                <Th>Muscles Used</Th>
                                                                <Th>Sets</Th>
                                                                <Th>Reps</Th>
                                                                <Th>Intensity</Th>
                                                                <Th>Load</Th>
                                                                <Th>Rest Time</Th>
                                                                <Th>Instructions</Th>
                                                                <Th>Action</Th>
                                                            </Tr>
                                                        </Thead>
                                                        <Tbody>
                                                            {dayExercises.map((exercise, exerciseIndex) => (
                                                                <Tr key={exerciseIndex}>
                                                                    <Td>
                                                                        <Select
                                                                            defaultValue={exercise.type}
                                                                            name="type"
                                                                            isReadOnly={!isEditing}
                                                                            onChange={(e) => handleSelectChange(e, exerciseIndex, "type")}
                                                                        >
                                                                            {exerciseType.map((type, index) => (
                                                                                <option key={index} value={type}>{type}</option>
                                                                            ))}
                                                                        </Select>
                                                                    </Td>
                                                                    <Td>
                                                                        <Input
                                                                            defaultValue={exercise.name}
                                                                            isReadOnly={!isEditing}
                                                                            onChange={(e) => handleInputChange(e, exerciseIndex, "name")}
                                                                        />
                                                                    </Td>
                                                                    <Td>
                                                                        <VStack spacing={2}>
                                                                            <Select
                                                                                defaultValue={exercise.primaryMuscle}
                                                                                isReadOnly={!isEditing}
                                                                                onChange={(e) => handleSelectChange(e, exerciseIndex, "primaryMuscle")}
                                                                            >
                                                                                {muscles.map((m, index) => (
                                                                                    <option key={index} value={m}>{m}</option>
                                                                                ))}
                                                                            </Select>
                                                                            <Select
                                                                                defaultValue={exercise.secondaryMuscle}
                                                                                isReadOnly={!isEditing}
                                                                                onChange={(e) => handleSelectChange(e, exerciseIndex, "secondaryMuscle")}
                                                                            >
                                                                                {muscles.map((m, index) => (
                                                                                    <option key={index} value={m}>{m}</option>
                                                                                ))}
                                                                            </Select>
                                                                        </VStack>
                                                                    </Td>
                                                                    <Td>
                                                                        <Input
                                                                            defaultValue={exercise.sets?.toString() || "N/A"}
                                                                            isReadOnly={!isEditing}
                                                                            onChange={(e) => handleInputChange(e, exerciseIndex, "sets")}
                                                                        />
                                                                    </Td>
                                                                    <Td>
                                                                        <Input
                                                                            defaultValue={exercise.indicatedReps?.toString() || ""}
                                                                            isReadOnly={!isEditing}
                                                                            onChange={(e) => handleInputChange(e, exerciseIndex, "indicatedReps")}
                                                                        />
                                                                    </Td>
                                                                    <Td>
                                                                        <Select
                                                                            defaultValue={exercise.intensity?.type || ""}
                                                                            isReadOnly={!isEditing}
                                                                            onChange={(e) => handleSelectChange(e, exerciseIndex, "intensity")}
                                                                        >
                                                                            <option value="RPE">RPE</option>
                                                                            <option value="RIR">RIR</option>
                                                                        </Select>
                                                                    </Td>
                                                                    <Td>
                                                                        <Input
                                                                            defaultValue={exercise.indicatedLoad?.toString() || "N/A"}
                                                                            isReadOnly={!isEditing}
                                                                            onChange={(e) => handleInputChange(e, exerciseIndex, "indicatedLoad")}
                                                                        />
                                                                    </Td>
                                                                    <Td>
                                                                        <Input
                                                                            defaultValue={exercise.rest}
                                                                            isReadOnly={!isEditing}
                                                                            onChange={(e) => handleInputChange(e, exerciseIndex, "rest")}
                                                                        />
                                                                    </Td>
                                                                    <Td>
                                                                        <Input
                                                                            defaultValue={exercise.instructions}
                                                                            isReadOnly={!isEditing}
                                                                            onChange={(e) => handleInputChange(e, exerciseIndex, "instructions")}
                                                                        />
                                                                    </Td>
                                                                    {isEditing && (
                                                                        <Td>
                                                                            <Button colorScheme="red" onClick={() => handleDeleteExercise(exerciseIndex)}>
                                                                                Remove Exercise
                                                                            </Button>
                                                                        </Td>
                                                                    )}
                                                                </Tr>
                                                            ))}
                                                        </Tbody>
                                                    </Table>
                                                </TableContainer>

                                                {isEditing && (
                                                    <Button onClick={() => handleAddExercise(week, dayIndex + 1)} colorScheme="blue">
                                                        Add exercise
                                                    </Button>
                                                )}
                                            </Box>
                                        );
                                    })}
                                </Box>
                            ))}
                        </VStack>
                    </Box>
                </TabPanel>
                <TabPanel>
                    <BlockDetails block={block} />
                </TabPanel>
                <TabPanels>
                    [TO DO]
                </TabPanels>
            </TabPanels>
        </Tabs>


    );
};
