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
import {useAppSelector} from "@/app/redux/hooks";

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
    //const username = useAppSelector(state => state.auth.user.username);


    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUsername(user.username);

            const fetchAthletes = async (username: string) => {
                try {
                    const response = await fetch('/api/home', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ username }),
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
            fetchAthletes(user.username);
        }
    }, []);

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
                    {athletes && athletes.length > 0 ? (
                        athletes.map((item) => (
                            <HomeAthleteRow
                                key={item._id}
                                athleteName={item.name}
                                actualBloc={item.bloc}
                                lastUpdate={item.date}
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
