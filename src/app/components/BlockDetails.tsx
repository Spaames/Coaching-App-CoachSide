"use client"


import React, {useEffect, useState} from "react";
import {Block, Exercise} from "@/app/redux/features/blockSlice";
import data from "@/lib/data.json"
import {
    Card,
    CardBody,
    CardHeader,
    Heading,
    SimpleGrid,
    Table,
    TableContainer, Tbody, Td,
    Th,
    Thead,
    Tr
} from "@chakra-ui/react";


interface BlockDetailsProps {
    block: Block,
}

interface MuscleSeries {
    [key: string]: number
}

interface WeekMuscleVolume {
    [week: number]: MuscleSeries
}

const BlockDetails: React.FC<BlockDetailsProps> = ({ block }) => {
    const [muscleVolume, setMuscleVolume] = useState<WeekMuscleVolume>();
    const [movementVolume, setMovementVolume] = useState<{ [week: number]: { [type: string]: number } }>({});

    const muscleGroups = data.muscles;

    const calculateMuscleVolume = (exercises: Exercise[]): { [week: number]: MuscleSeries } => {
        const seriesByWeek: { [week: number]: MuscleSeries } = {};

        exercises.forEach(exercise => {
            const week = exercise.week;
            const sets = exercise.sets || 0;

            if (!seriesByWeek[week]) {
                seriesByWeek[week] = {};
                muscleGroups.forEach(muscle => {
                    seriesByWeek[week][muscle] = 0;
                });
            }

            if (exercise.primaryMuscle && muscleGroups.includes(exercise.primaryMuscle)) {
                seriesByWeek[week][exercise.primaryMuscle] += sets;
            }

            if (exercise.secondaryMuscle && muscleGroups.includes(exercise.secondaryMuscle)) {
                seriesByWeek[week][exercise.secondaryMuscle] += sets * 0.5;
            }
        });
        return seriesByWeek;
    };

    const calculateMovementVolume = (exercises: Exercise[]): { [week: number]: { [type: string]: number } } => {
        const setsByTypeAndWeek: { [week: number]: { [type: string]: number } } = {};

        exercises.forEach(exercise => {
            const week = exercise.week;
            const sets = exercise.sets || 0;
            const type = exercise.type || "Unknown";

            // Initialize week and type if not already
            if (!setsByTypeAndWeek[week]) {
                setsByTypeAndWeek[week] = {};
            }
            if (!setsByTypeAndWeek[week][type]) {
                setsByTypeAndWeek[week][type] = 0;
            }

            // Add sets to the appropriate type for the week
            setsByTypeAndWeek[week][type] += sets;
        });

        return setsByTypeAndWeek;
    };


    useEffect(() => {
        setMuscleVolume(calculateMuscleVolume(block.exercises));
        setMovementVolume(calculateMovementVolume(block.exercises));
    }, [block]);

    return (
        <SimpleGrid spacing={4} templateColumns='repeat(auto-fill)'>
            <Card>
                <CardHeader>
                    <Heading size='md'>Volume (Movement by Week)</Heading>
                </CardHeader>
                <CardBody>
                    <TableContainer>
                        <Table size='sm' variant='striped' colorScheme='gray'>
                            <Thead>
                                <Tr>
                                    <Th>Movement</Th>
                                    {Object.keys(movementVolume).map((week, index) => (
                                        <Th key={week}>Week {index + 1}</Th>
                                    ))}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {(() => {
                                    const allMovements = new Set<string>();
                                    Object.keys(movementVolume).forEach(week => {
                                        Object.keys(movementVolume[parseInt(week)] || {}).forEach(movement => {
                                            allMovements.add(movement);
                                        });
                                    });
                                    return Array.from(allMovements).map(movement => (
                                        <Tr key={movement}>
                                            <Td>{movement}</Td>
                                            {Object.keys(movementVolume).map(week => (
                                                <Td key={`${week}-${movement}`}>
                                                    {movementVolume[parseInt(week)][movement] || 0}
                                                </Td>
                                            ))}
                                        </Tr>
                                    ));
                                })()}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </CardBody>
            </Card>
            <Card>
                <CardHeader>
                    <Heading size='md'>Volume (Muscles by Week)</Heading>
                </CardHeader>
                <CardBody>
                    <TableContainer>
                        <Table size='sm' variant='striped' colorScheme='gray'>
                            <Thead>
                                <Tr>
                                    <Th>Muscle Group</Th>
                                    {/* Dynamically generate week columns with adjusted numbering */}
                                    {muscleVolume && Object.keys(muscleVolume).map((week, index) => (
                                        <Th key={week}>Week {index + 1}</Th>
                                    ))}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {/* Create a set of all muscle groups across all weeks */}
                                {(() => {
                                    if (!muscleVolume) return null;

                                    // Create a set of all muscle groups across all weeks, ignoring 'None'
                                    const allMuscleGroups = new Set<string>();
                                    Object.keys(muscleVolume).forEach(week => {
                                        Object.keys(muscleVolume[parseInt(week)] || {}).forEach(muscle => {
                                            if (muscle !== "None") { // Ignore 'None'
                                                allMuscleGroups.add(muscle);
                                            }
                                        });
                                    });

                                    // Filter muscles that have 0 in all weeks
                                    const musclesWithVolume = Array.from(allMuscleGroups).filter(muscle => {
                                        return Object.keys(muscleVolume).some(week => muscleVolume[parseInt(week)][muscle] > 0);
                                    });

                                    // Now iterate over filtered muscles and display data for each week
                                    return musclesWithVolume.map(muscle => (
                                        <Tr key={muscle}>
                                            <Td>{muscle}</Td>
                                            {Object.keys(muscleVolume).map(week => (
                                                <Td key={`${week}-${muscle}`}>
                                                    {muscleVolume[parseInt(week)][muscle] || 0}
                                                </Td>
                                            ))}
                                        </Tr>
                                    ));
                                })()}
                            </Tbody>
                        </Table>
                    </TableContainer>

                </CardBody>
            </Card>
        </SimpleGrid>
    );
}

export default BlockDetails;