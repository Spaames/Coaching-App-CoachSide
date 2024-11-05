'use client'

import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    TableContainer, Td,
} from '@chakra-ui/react';
import HomeAthleteRow from "@/app/components/HomeAthleteRow";
import {useEffect, useState} from "react";

export default function Page() {

    interface Athlete {
        _id: string;
        name: string;
        bloc: string;
        date: string;
        username: string;
    }

    const [athletes, setAthletes] = useState<Athlete[]>([]);
    const [username, setUsername] = useState<string>("");

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser).split("-");
                if (!user || user[0] === undefined || user[0] === "") {
                    console.error("Invalid data in localStorage");
                } else {
                    setUsername(user[0]);
                    const fetchAthletes = async (username: string) => {
                        try {
                            const response = await fetch('/api/home', {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({username}),
                            });

                            const data = await response.json();
                            if (response.ok && data.athleteList) {
                                setAthletes(data.athleteList);
                            }
                        } catch (error) {
                            console.log(error);
                            setAthletes([]);
                        }
                    };
                    fetchAthletes(username);
                }
            } catch (error) {
                console.error(error);
            }
        }
    }, [username,]);

    return (
        <TableContainer>
            <Table variant='simple' size='lg'>
                <Thead>
                    <Tr>
                        <Th>Athlete(s)</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {athletes && athletes.length > 0 ? (
                        athletes.map((item) => (
                            <HomeAthleteRow
                                key={item._id}
                                athleteName={item.name}
                                athleteLink={"/athletes/" + item.username}
                            />
                        ))
                    ) : (
                        <Tr>
                            <Td colSpan={4}>No athletes found.</Td>
                        </Tr>
                    )}
                </Tbody>
            </Table>
        </TableContainer>
    );
}
