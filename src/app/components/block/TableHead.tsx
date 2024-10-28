'use client';

import {Select, Stack} from "@chakra-ui/react";

interface TableHeadProps {
    columnTypes: string[];
    onChange: (value: string) => void;
}


const TableHead: React.FC<TableHeadProps> = ({columnTypes, onChange}) => {

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(event.target.value);
    };

    return (
        <Stack spacing={3}>
            <Select variant="filled" whiteSpace="nowrap" minWidth="auto" onChange={handleSelectChange}>
                {columnTypes.map((type, index) => (
                    <option key={index} value={type}>
                        {type}
                    </option>
                ))}
            </Select>
        </Stack>
    );
}

export default TableHead;
