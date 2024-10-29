import {Tr, Td, Select, Input, HStack, VStack} from "@chakra-ui/react";
import data from "@/lib/data.json"

interface TableRowProps {
    day: number;
    week: number;
    rowId: number;
}

const TableRow: React.FC<TableRowProps> = ({ day, week, rowId }) => {
    const exerciseType = data.exerciseType;
    const muscles = data.muscles;
    /*
    return (
        <Tr id={rowId + "-" + day + "-" + week}>
            {selectedColumns.map((selectedValue, index) => (
                <Td key={index} id={selectedValue + "-" + rowId + "-" + day + "-" + week}>
                    <DynamicInput selectedValue={selectedValue} rowId={rowId} day={day} week={week}></DynamicInput>
                </Td>
            ))}
        </Tr>
    );
     */

    return (
        <Tr key={rowId}>
            <Td>
                <Select id={"type-" + rowId +"-" + day + "-" + week} name="type" whiteSpace="nowrap" minWidth="auto">
                    {exerciseType.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                    ))}
                </Select>
            </Td>
            <Td>
                <VStack spacing={2}>
                    <Select id={`primaryMuscle-${rowId}-${day}-${week}`} whiteSpace="nowrap" minWidth="auto">
                        {muscles.map((m, index) => (
                            <option key={index} value={m}>{m}</option>
                        ))}
                    </Select>
                    <Select id={`secondaryMuscle-${rowId}-${day}-${week}`} whiteSpace="nowrap" minWidth="auto">
                        {muscles.map((m, index) => (
                            <option key={index} value={m}>{m}</option>
                        ))}
                    </Select>
                </VStack>
            </Td>
            <Td>
                <Input name="exercise" id={"exercise-" + rowId +"-" + day + "-" + week} variant='outline' placeholder='Name' />
            </Td>
            <Td>
                <HStack spacing={2}>
                    <Input name="sets" id={"sets-" + rowId +"-" + day + "-" + week} maxW={20} variant='outline' placeholder='Sets' />
                    <span>X</span>
                    <Input name="reps" id={"reps-" + rowId +"-" + day + "-" + week} maxW={20} variant='outline' placeholder='Reps' />
                </HStack>
            </Td>
            <Td>
                <Input name="intensity" id={"intensity-" + rowId +"-" + day + "-" + week} maxW={20} variant='outline' placeholder='Intensity' />
            </Td>
            <Td>
                <Input name="load" id={"load-" + rowId +"-" + day + "-" + week} maxW={20} variant='outline' placeholder='Load' />
            </Td>
            <Td>
                <Input name="rest" id={"rest-" + rowId +"-" + day + "-" + week} maxW={20} variant='outline' placeholder='Rest Time' />
            </Td>
            <Td>
                <Input name="instructions" id={"instructions-" + rowId +"-" + day + "-" + week} variant='outline' placeholder='Instructions' />
            </Td>
        </Tr>
    )

};

export default TableRow;
