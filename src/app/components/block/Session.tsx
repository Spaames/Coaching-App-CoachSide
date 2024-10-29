'use client';

import React, { useState } from 'react';
import {
    Table,
    Thead,
    Tr,
    Tbody,
    Box,
    Button,
    HStack,
    Heading,
} from "@chakra-ui/react";
import data from "@/lib/data.json";
import TableRow from "@/app/components/block/TableRow";

interface SessionProps {
    day: number;
    week: number;
}

const Session: React.FC<SessionProps> = ({ day, week }) => {
    const columns = data.blockHead;
    //const [selectedColumns, setSelectedColumns] = useState<string[]>(columns.map(() => ''));
    const [rows, setRows] = useState<number[]>([]);

    /*
    const handleColumnChange = (index: number, value: string) => {
        const newSelections = [...selectedColumns];
        newSelections[index] = value;
        setSelectedColumns(newSelections);
    };
    */

    const addRow = () => {
        setRows([...rows, rows.length + 1]);
    };

    const removeRow = () => {
        setRows(rows.slice(0, -1));
    };

    /*
    return (
        <Box overflow="auto" width="100%" marginBottom="25" id={`session-${day}-${week}`}>
            <HStack marginBottom={4}>
                <Button colorScheme="teal" onClick={addRow}>+</Button>
                <Button colorScheme="red" onClick={removeRow} isDisabled={rows.length === 0}>-</Button>
            </HStack>
            <Heading as='h4' size='md'>
                {day} - Week : {week}
            </Heading>
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
                        <TableRow key={rowId} selectedColumns={selectedColumns} rowId={rowId} day={day} week={week} />
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
    */
    return (
        <Box overflow="auto" width="100%" marginBottom="25" id={`session-${day}-${week}`}>
            <HStack marginBottom={4}>
                <Button colorScheme="teal" onClick={addRow}>+</Button>
                <Button colorScheme="red" onClick={removeRow} isDisabled={rows.length === 0}>-</Button>
            </HStack>
            <Heading as='h4' size='md'>
                {day} - Week : {week}
            </Heading>
            <Table size="sm" minWidth="max-content">
                <Thead>
                    <Tr>
                        {columns.map((column, index) => (
                            <th key={index}>{column}</th>
                        ))}
                    </Tr>
                </Thead>
                <Tbody>
                    {rows.map((rowId) => (
                        <TableRow key={rowId} rowId={rowId} day={day} week={week} />
                    ))}
                </Tbody>
            </Table>
        </Box>
    )
};

export default Session;
