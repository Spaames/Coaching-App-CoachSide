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
    const muscleGroups = data.muscles;

    const handleVolumeCalc = (exercises: Exercise[]): { [week: number]: MuscleSeries } => {
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
        console.log(seriesByWeek);
        return seriesByWeek;
    };

    useEffect(() => {
        setMuscleVolume(handleVolumeCalc(block.exercises));
    }, [block]);

    return (
        <p>{block.name}</p>
    );
}

export default BlockDetails;