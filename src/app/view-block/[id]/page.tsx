"use client"

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
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
import { Block, deleteBlockThunk, Exercise, updateBlockThunk } from "@/app/redux/features/blockSlice";
import data from "@/lib/data.json";
import BlockDetails from "@/app/components/BlockDetails";
import { useRouter } from "next/navigation";

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

    const handleEdit = () => setIsEditing(!isEditing);

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
            router.push('/home');
        }
    };

    const handleInputChange = <K extends keyof Exercise>(
        e: React.ChangeEvent<HTMLInputElement>,
        day: number,
        week: number,
        order: number,
        field: K
    ) => {
        const newExercises = editedBlock.exercises.map((exercise) =>
            exercise.day === day && exercise.week === week && exercise.order === order
                ? { ...exercise, [field]: field === "sets" || field === "indicatedLoad" ? parseInt(e.target.value, 10) : e.target.value }
                : exercise
        );

        setEditedBlock({ ...editedBlock, exercises: newExercises });
    };

    const handleSelectChange = <K extends keyof Exercise>(
        e: React.ChangeEvent<HTMLSelectElement>,
        day: number,
        week: number,
        order: number,
        field: K
    ) => {
        const newExercises = editedBlock.exercises.map((exercise) =>
            exercise.day === day && exercise.week === week && exercise.order === order
                ? { ...exercise, [field]: e.target.value as Exercise[K] }
                : exercise
        );

        setEditedBlock({ ...editedBlock, exercises: newExercises });
    };

    const handleAddExercise = (week: number, day: number) => {
        const newOrder = editedBlock.exercises
            .filter(ex => ex.week === week && ex.day === day).length + 1;
        const newExercise: Exercise = {
            name: '',
            type: exerciseType[0],
            sets: 0,
            indicatedReps: "",
            indicatedLoad: "",
            primaryMuscle: muscles[0],
            secondaryMuscle: muscles[0],
            intensity: "",
            realPerf: null,
            rest: '',
            instructions: '',
            week,
            day,
            order: newOrder
        };

        setEditedBlock({
            ...editedBlock,
            exercises: [...editedBlock.exercises, newExercise]
        });
    };

    const handleDeleteExercise = (day: number, week: number, order: number) => {
        const newExercises = editedBlock.exercises
            .filter(exercise => !(exercise.day === day && exercise.week === week && exercise.order === order))
            .map((exercise, index) => ({ ...exercise, order: index + 1 }));

        setEditedBlock({ ...editedBlock, exercises: newExercises });
    };

    if (!block) return <p>Block not found</p>;

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
                                                            {dayExercises.map((exercise) => (
                                                                <Tr key={`${exercise.week}-${exercise.day}-${exercise.order}`}>
                                                                    <Td>
                                                                        <Select
                                                                            defaultValue={exercise.type}
                                                                            isReadOnly={!isEditing}
                                                                            onChange={(e) => handleSelectChange(e, exercise.day, exercise.week, exercise.order, "type")}
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
                                                                            onChange={(e) => handleInputChange(e, exercise.day, exercise.week, exercise.order, "name")}
                                                                        />
                                                                    </Td>
                                                                    <Td>
                                                                        <VStack spacing={2}>
                                                                            <Select
                                                                                defaultValue={exercise.primaryMuscle}
                                                                                isReadOnly={!isEditing}
                                                                                onChange={(e) => handleSelectChange(e, exercise.day, exercise.week, exercise.order, "primaryMuscle")}
                                                                            >
                                                                                {muscles.map((m, index) => (
                                                                                    <option key={index} value={m}>{m}</option>
                                                                                ))}
                                                                            </Select>
                                                                            <Select
                                                                                defaultValue={exercise.secondaryMuscle}
                                                                                isReadOnly={!isEditing}
                                                                                onChange={(e) => handleSelectChange(e, exercise.day, exercise.week, exercise.order, "secondaryMuscle")}
                                                                            >
                                                                                {muscles.map((m, index) => (
                                                                                    <option key={index} value={m}>{m}</option>
                                                                                ))}
                                                                            </Select>
                                                                        </VStack>
                                                                    </Td>
                                                                    <Td>
                                                                        <Input
                                                                            defaultValue={exercise.sets?.toString() || ""}
                                                                            isReadOnly={!isEditing}
                                                                            onChange={(e) => handleInputChange(e, exercise.day, exercise.week, exercise.order, "sets")}
                                                                        />
                                                                    </Td>
                                                                    <Td>
                                                                        <Input
                                                                            defaultValue={exercise.indicatedReps?.toString() || ""}
                                                                            isReadOnly={!isEditing}
                                                                            onChange={(e) => handleInputChange(e, exercise.day, exercise.week, exercise.order, "indicatedReps")}
                                                                        />
                                                                    </Td>
                                                                    <Td>
                                                                        <Input
                                                                            defaultValue={exercise.intensity?.toString() || ""}
                                                                            isReadOnly={!isEditing}
                                                                            onChange={(e) => handleInputChange(e, exercise.day, exercise.week, exercise.order, "intensity")}
                                                                        />
                                                                    </Td>
                                                                    <Td>
                                                                        <Input
                                                                            defaultValue={exercise.indicatedLoad?.toString() || ""}
                                                                            isReadOnly={!isEditing}
                                                                            onChange={(e) => handleInputChange(e, exercise.day, exercise.week, exercise.order, "indicatedLoad")}
                                                                        />
                                                                    </Td>
                                                                    <Td>
                                                                        <Input
                                                                            defaultValue={exercise.rest || ""}
                                                                            isReadOnly={!isEditing}
                                                                            onChange={(e) => handleInputChange(e, exercise.day, exercise.week, exercise.order, "rest")}
                                                                        />
                                                                    </Td>
                                                                    <Td>
                                                                        <Input
                                                                            defaultValue={exercise.instructions || ""}
                                                                            isReadOnly={!isEditing}
                                                                            onChange={(e) => handleInputChange(e, exercise.day, exercise.week, exercise.order, "instructions")}
                                                                        />
                                                                    </Td>
                                                                    {isEditing && (
                                                                        <Td>
                                                                            <Button colorScheme="red" onClick={() => handleDeleteExercise(exercise.day, exercise.week, exercise.order)}>
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
