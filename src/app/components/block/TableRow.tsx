import { Tr, Td } from "@chakra-ui/react";
import DynamicInput from "@/app/components/block/DynamicInput";

interface TableRowProps {
    selectedColumns: string[];
    day: number;
    week: number;
    rowId: number;
}

const TableRow: React.FC<TableRowProps> = ({ selectedColumns, day, week, rowId }) => {
    return (
        <Tr id={rowId + "-" + day + "-" + week}>
            {selectedColumns.map((selectedValue, index) => (
                <Td key={index} id={selectedValue + "-" + rowId + "-" + day + "-" + week}>
                    <DynamicInput selectedValue={selectedValue} rowId={rowId} day={day} week={week}></DynamicInput>
                </Td>
            ))}
        </Tr>
    );
};

export default TableRow;
