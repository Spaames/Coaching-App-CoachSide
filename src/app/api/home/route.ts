import { NextResponse, NextRequest} from "next/server";
import mongoClientPromise from "@/lib/mongodb";
import {dbName} from "@/lib/mongodb";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { username } = body;
        console.log(username);
        if (!username) {
            return NextResponse.json({ message: "Username is required" });
        }

        const mongoClient = await mongoClientPromise;
        const db = mongoClient.db(dbName);
        const userCollection = db.collection('users');

        const fetchList = userCollection.find(
            { referent: username.toString() }
        ).toArray();

        if ((await fetchList).length === 0) {
            return NextResponse.json({ message: "No athletes for this user " + username });
        }

        const athleteList = (await fetchList).map(item => ({
            _id: item.id,
            name: item.firstName + " " + item.lastName,
            bloc: "test 1",
            date: "07-07-2007",
            username: item.username,
        }))

        return NextResponse.json({ message: "Athletes for this user", athleteList: athleteList });

    } catch (error) {
        console.error("Error during registration", error);
    }
}