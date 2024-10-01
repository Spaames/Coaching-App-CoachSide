import { Tr, Td } from "@chakra-ui/react";
import DynamicInput from "@/app/components/block/DynamicInput";

interface TableRowProps {
    selectedColumns: string[];
}

const TableRow: React.FC<TableRowProps> = ({ selectedColumns }) => {
    return (
        <Tr>
            {selectedColumns.map((selectedValue, index) => (
                <Td key={index}>
                    <DynamicInput selectedValue={selectedValue}></DynamicInput>
                </Td>
            ))}
        </Tr>
    );
};

export default TableRow;
