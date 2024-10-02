import {
    Select,
    Input, NumberInput, NumberInputField,
    NumberIncrementStepper,
    NumberDecrementStepper,
    NumberInputStepper, HStack,
} from "@chakra-ui/react";
import data from "@/lib/data.json"

interface DynamicInputProps {
    selectedValue: string;
}

const DynamicInput: React.FC<DynamicInputProps> = ({selectedValue}) => {
    const columnName = selectedValue.toLowerCase();
    const exerciseType = data.exerciseType;
    const rpeValue = data.rpe;

    if (columnName === "none") {
        return null;
    }

    switch (columnName) {
        case "type":
            return (
                <Select name="type" whiteSpace="nowrap" minWidth="auto">
                    {exerciseType.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                    ))}
                </Select>
            );
        case "exercise":
            return (
                <Input name="exercise" id="exercice" variant='outline' placeholder='Name' />
            );
        case "sets x reps":
            return (
                <HStack spacing={2}>
                    <Input name="sets" id="sets" maxW={20} variant='outline' placeholder='Sets' />
                    <span>X</span>
                    <Input name="reps" id="reps" maxW={20} variant='outline' placeholder='Reps' />
                </HStack>
            );
        case "rpe":
            return (
                <Select name="rpe" id="rpe" variant='outline'>
                    {rpeValue.map((rpe, index) => (
                        <option key={index} value={rpe}>{rpe}</option>
                    ))}
                </Select>
            );
        case "%1rm":
            return (
                <HStack>
                    <Input name="%1rm" id="%1rm" maxW={20} variant='outline' placeholder='%1RM' />
                    <span>%</span>
                </HStack>
            );
        case "rir":
            return (
                <Input name="rir" id="rir" maxW={20} variant='outline' placeholder='RIR' />
            );
        case "tst":
            return (
                <Input name="tst" id="tst" maxW={20} variant='outline' placeholder='TST' />
            );
        case "rpe perceived":
            return (
                <Input name="rpePerc" id="rpePerc" variant="outline" placeholder='RPE perc' disabled />
            );
        case "load":
            return (
                <Input name="load" id="load" maxW={20} variant='outline' placeholder='Load' />
            );
        case "rest time":
            return (
                <Input name="rest" id="rest" maxW={20} variant='outline' placeholder='Rest Time' />
            );
        case "instructions":
            return (
                <Input name="instruc" id="instruc" variant='outline' placeholder='Instructions' />
            );
    }
}

export default DynamicInput;