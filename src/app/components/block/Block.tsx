'use client';

import React, { useState } from 'react';
import {
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Box,
    Button,
    HStack,
    Divider,
    AbsoluteCenter, Stack, Select,
} from "@chakra-ui/react";
import data from "@/lib/data.json";
import TableHead from "@/app/components/block/TableHead";
import TableRow from "@/app/components/block/TableRow";

interface BlockProps {
    athletes: string;
}

const Block: React.FC<BlockProps> = ({ athletes }) => {
    const columns = data.blockHead;
    const [selectedColumns, setSelectedColumns] = useState<string[]>(columns.map(() => ''));
    const [rows, setRows] = useState<number[]>([]);

    const handleColumnChange = (index: number, value: string) => {
        const newSelections = [...selectedColumns];
        newSelections[index] = value;
        setSelectedColumns(newSelections);
    };

    const addRow = () => {
        setRows([...rows, rows.length + 1]);
    };

    const removeRow = () => {
        setRows(rows.slice(0, -1));
    };

    return (
        <Box overflow="auto" width="100%" marginBottom="25">
            <Box position='relative' padding='10'>
                <Divider />
                <AbsoluteCenter bg='white' px='4'>
                    <Stack spacing={2}>
                        <Select variant="filled" whiteSpace="nowrap" minWidth="auto">
                            <option key="1" value="Monday">Monday</option>
                            <option key="2" value="Tuesday">Tuesday</option>
                            <option key="3" value="Wednesday">Wednesday</option>
                            <option key="4" value="Thursday">Thursday</option>
                            <option key="5" value="Friday">Friday</option>
                            <option key="6" value="Saturday">Saturday</option>
                            <option key="7" value="Sunday">Sunday</option>
                        </Select>
                    </Stack>
                </AbsoluteCenter>
            </Box>
            <HStack marginBottom={4}>
                <Button colorScheme="teal" onClick={addRow}>Add Exercise</Button>
                <Button colorScheme="red" onClick={removeRow} isDisabled={rows.length === 0}>Remove Exercise</Button>
            </HStack>

            <Table size="sm" minWidth="max-content">
                <Thead>
                    <Tr>
                        {columns.map((column, index) => (
                            <Th key={index}>
                                <TableHead
                                    key={index}
                                    columnTypes={columns}
                                    onChange={(value: string) => handleColumnChange(index, value)}
                                />
                            </Th>
                        ))}
                    </Tr>
                </Thead>
                <Tbody>
                    {rows.map((rowId) => (
                        <TableRow key={rowId} selectedColumns={selectedColumns} />
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default Block;
