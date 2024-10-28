'use client';

import {
    Tr,
    Td, Link, Icon, Text, Flex,
} from '@chakra-ui/react'
import { FaEdit } from "react-icons/fa";

interface HomeAthleteRowProps {
    athleteName: string,
    actualBloc : string,
    lastUpdate: string,
    athleteLink: string,
}

const HomeAthleteRow: React.FC<HomeAthleteRowProps> = ({ athleteName, actualBloc, lastUpdate, athleteLink }) => {
    return (
        <Tr>
            <Td>{athleteName}</Td>
            <Td>{actualBloc}</Td>
            <Td>{lastUpdate}</Td>
            <Td>
                <Link href={athleteLink}>
                    <Flex>
                        <Icon as={FaEdit} mr="4" fontSize="20px" />
                        <Text>Edit</Text>
                    </Flex>
                </Link>
            </Td>
        </Tr>
    )
}

export default HomeAthleteRow;