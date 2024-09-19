'use client'

import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
} from '@chakra-ui/react'

export default function Page() {

    return (
        <TableContainer>
            <Table variant='simple' size='lg'>
                <Thead>
                    <Tr>
                        <Th>Athlete(s)</Th>
                        <Th>Actual Block</Th>
                        <Th>Last Update</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>inches</Td>
                        <Td>millimetres (mm)</Td>
                        <Td>25.4</Td>
                        <Td>bite</Td>
                    </Tr>
                </Tbody>
            </Table>
        </TableContainer>
    );
}
