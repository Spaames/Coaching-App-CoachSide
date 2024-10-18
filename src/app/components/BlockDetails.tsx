"use client"


import React, {useEffect, useState} from "react";
import {Block, Exercise} from "@/app/redux/features/blockSlice";
import data from "@/lib/data.json"


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
        <p>{block.name}</p>
    );
}

export default BlockDetails;