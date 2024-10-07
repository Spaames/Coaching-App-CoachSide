import { NextResponse, NextRequest } from "next/server";
import mongoClientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
    try {
        const exercises = await req.json();

        if (!exercises || exercises.length === 0) {
            return NextResponse.json({ message: "No exercises found" }, {status: 400});
        }


        const mongoClient = await mongoClientPromise;
        const db = mongoClient.db("rmManagerDev");
        const collection = db.collection("exercises");

        for (const exercise of exercises) {
            await collection.insertOne(exercise);
        }

        return NextResponse.json({ message: "Sessions saved" }, {status: 200});

    } catch (e) {
        console.log(e);
        return NextResponse.json({ message: "Failed to save exercises", status: 500 });
    }
}