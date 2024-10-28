'use client'

import React, { useEffect } from 'react'
import {
    Button,
    VStack,
} from "@chakra-ui/react";
import Link from "next/link";

import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import { getBlocksThunk, Block } from "@/app/redux/features/blockSlice";

interface ViewBlocksProps {
    athlete: string;
}

const ViewBlocks: React.FC<ViewBlocksProps> = ({ athlete }) => {
    const blockListStore = useAppSelector((state) => state.block.blocks);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getBlocksThunk(athlete));
    }, [athlete, dispatch]);

    const getActualWeekNumber = (date: Date = new Date()): number => {
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const daysElapsed = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
        const startDay = startOfYear.getDay() || 7;
        return Math.ceil((daysElapsed + startDay) / 7);
    }

    const isCurrentBlock = (block: Block): boolean => {
        const currentWeek = getActualWeekNumber();
        const currentYear = new Date().getFullYear();

        const [startWeek, startYear] = block.start!.split('-').map(Number);
        const [endWeek, endYear] = block.end!.split('-').map(Number);

        return startWeek <= currentWeek && currentWeek <= endWeek && startYear <= currentYear && currentYear <= endYear;
    }

    if ( blockListStore && blockListStore.length === 0) return null;


    return (
        <>
            <VStack spacing={2}>
                {blockListStore && blockListStore.length > 0 && (
                    [...blockListStore].reverse().map((block, index) => (
                    <Link key={index} href={`/view-block/${block.id}`} passHref>
                        <Button
                            colorScheme={isCurrentBlock(block)?"green":"gray"}
                            variant="outline"
                            width="100%"
                        >
                            {block.name}
                        </Button>
                    </Link>
                )))}
            </VStack>
        </>
    );
}

export default ViewBlocks;