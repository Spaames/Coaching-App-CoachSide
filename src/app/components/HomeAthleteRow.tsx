'use client';

import {
    Tr,
    Td, Link, Icon, Text, Flex,
} from '@chakra-ui/react'
import { FaEdit } from "react-icons/fa";

interface HomeAthleteRowProps {
    athleteName: string,
    athleteLink: string,
}

const HomeAthleteRow: React.FC<HomeAthleteRowProps> = ({ athleteName, athleteLink }) => {
    return (
        <Tr>
            <Td>{athleteName}</Td>
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