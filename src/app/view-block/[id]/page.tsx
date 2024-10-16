"use client"

import { useState } from 'react';
import {useAppDispatch, useAppSelector} from "@/app/redux/hooks";
import {
    Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Heading, Button, Input, VStack, Select
} from "@chakra-ui/react";
import {Block, Exercise, updateBlockThunk} from "@/app/redux/features/blockSlice";

export default function Page({ params }: { params: { id: string } }) {
    const block = useAppSelector((state) => state.block.blocks.find(block => block.id === params.id));
    const [isEditing, setIsEditing] = useState(false);
    const [editedBlock, setEditedBlock] = useState<Block>(block || {
        id: "",
        name: "",
        start: "",
        end: "",
        athlete: "",
        exercises : []
    });

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

    const handleInputChange = <K extends keyof Exercise>(
        e: React.ChangeEvent<HTMLInputElement>,
        exerciseIndex: number,
        field: K
    ) => {
        const newExercises = [...editedBlock.exercises];  // Crée une copie des exercices
        const updatedExercise = { ...newExercises[exerciseIndex] };  // Crée une copie de l'exercice à modifier

        // Gérer les conversions pour les valeurs numériques
        if (field === "sets" || field === "indicatedReps" || field === "indicatedLoad" +
            "") {
            updatedExercise[field] = parseInt(e.target.value, 10) as Exercise[K];
        } else {
            updatedExercise[field] = e.target.value as Exercise[K];
        }

        newExercises[exerciseIndex] = updatedExercise;  // Met à jour l'exercice modifié dans la liste

        setEditedBlock({ ...editedBlock, exercises: newExercises });  // Met à jour l'état avec les exercices modifiés
    };

    const handleSelectChange = <K extends keyof Exercise>(
        e: React.ChangeEvent<HTMLSelectElement>,
        exerciseIndex: number,
        field: K
    ) => {
        const newExercises = [...editedBlock.exercises];  // Crée une copie des exercices
        const updatedExercise = { ...newExercises[exerciseIndex] };  // Crée une copie de l'exercice à modifier

        updatedExercise[field] = e.target.value as Exercise[K];  // Met à jour la valeur sélectionnée

        newExercises[exerciseIndex] = updatedExercise;  // Met à jour l'exercice modifié dans la liste

        setEditedBlock({ ...editedBlock, exercises: newExercises });  // Met à jour l'état avec les exercices modifiés
    };


    if (!block) {
        return <p>Block not found</p>;
    }

    const weeks = Array.from(new Set(block.exercises.map(ex => ex.week))).sort((a, b) => a - b);

    const startWeek = weeks[0];
    const endWeek = weeks[weeks.length - 1];

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    return (
        <Box>
            <Heading size="lg" mb={4}>
                {block.name} - {block.athlete} (Weeks {startWeek} to {endWeek})
            </Heading>
            <Button onClick={handleEdit} colorScheme="blue" mb={4}>
                {isEditing ? "Cancel" : "Modify"}
            </Button>

            {isEditing && (
                <Button onClick={handleSave} colorScheme="green" mb={4} ml={4}>
                    Submit
                </Button>
            )}

            <VStack spacing={8}>
                {weeks.map((week, index) => (
                    <Box key={week} w="100%">
                        <Heading size="md" mb={4}>Week {index + 1}</Heading>

                        {Array.from({ length: 7 }, (_, dayIndex) => {
                            const dayExercises = block.exercises
                                .filter(ex => ex.week === week && ex.day === dayIndex + 1)
                                .sort((a, b) => a.order - b.order);

                            if (dayExercises.length === 0) return null;

                            return (
                                <TableContainer key={dayIndex} w="100%" mb={8}>
                                    <Heading size="sm" mb={4}>{daysOfWeek[dayIndex]}</Heading>
                                    <Table variant="simple" size="sm">
                                        <Thead>
                                            <Tr>
                                                <Th>Type</Th>
                                                <Th>Exercise</Th>
                                                <Th>Sets</Th>
                                                <Th>Reps</Th>
                                                <Th>Intensity</Th>
                                                <Th>Load</Th>
                                                <Th>Rest Time</Th>
                                                <Th>Instructions</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {dayExercises.map((exercise, exerciseIndex) => (
                                                <Tr key={exerciseIndex}>
                                                    <Td>
                                                        <Input
                                                            defaultValue={exercise.type}
                                                            isReadOnly={!isEditing}
                                                            onChange={(e) => handleInputChange(e, exerciseIndex, "type")}
                                                        />
                                                    </Td>
                                                    <Td>
                                                        <Input
                                                            defaultValue={exercise.name}
                                                            isReadOnly={!isEditing}
                                                            onChange={(e) => handleInputChange(e, exerciseIndex, "name")}
                                                        />
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
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            );
                        })}
                    </Box>
                ))}
            </VStack>
        </Box>
    );
};
