'use client'

import React, { useState, useEffect } from 'react'
import {
    AccordionItem,
    Accordion,
    AccordionButton,
    Box,
    AccordionIcon,
    AccordionPanel, HStack, TableContainer,
    Table,
    Tr,
    Td,
    Th,
    Thead,
    Tbody,
    Tfoot,
} from "@chakra-ui/react";
import { SpinnerIcon } from '@chakra-ui/icons';

import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import { getBlocksThunk } from "@/app/redux/features/blockSlice";

interface ViewBlocksProps {
    athlete: string;
}

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
}

interface Block {
    name: string;
    start: string;
    end: string;
    athlete: string;
    exercises: Exercise[];
}


const ViewBlocks: React.FC<ViewBlocksProps> = ({ athlete }) => {
    const blockListStore = useAppSelector((state) => state.block.blocks);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getBlocksThunk(athlete));
    }, [athlete]);

    const getActualWeekNumber = (date: Date = new Date()): number => {
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const daysElapsed = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
        const startDay = startOfYear.getDay() || 7;
        return Math.ceil((daysElapsed + startDay) / 7);
    }

    const isCurrentBlock = (block: Block): boolean => {
        const currentWeek = getActualWeekNumber();
        const currentYear = new Date().getFullYear();

        const [startWeek, startYear] = block.start.split('-').map(Number);
        const [endWeek, endYear] = block.end.split('-').map(Number);

        return startWeek <= currentWeek && currentWeek <= endWeek && startYear <= currentYear && currentYear <= endYear;
    }


    /*return (
        <Accordion allowToggle>
            {[...blockListStore].reverse().map((block, index) => (
                <AccordionItem key={index}>
                    <h2>
                        <AccordionButton>
                            <Box as="span" flex="1" textAlign="left">
                                {isCurrentBlock(block) ? (
                                    <SpinnerIcon />
                                ) : null }
                                {block.name}
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                        <TableContainer>
                            <Table size='sm'>
                                <Thead>

                                </Thead>
                                <Tbody>
                                    {block.exercises.map((exercise, index) => (
                                        <Tr key={index}>
                                            <Td></Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>

                    </AccordionPanel>
                </AccordionItem>
            ))}
        </Accordion>
    )
     */
    return null;
}

export default ViewBlocks;