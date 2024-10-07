import { NextResponse, NextRequest } from "next/server";
import mongoClientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
    try {
        const block = await req.json();

        if (!block) {
            return NextResponse.json({ message: "No block found" }, {status: 400});
        }

        const mongoClient = await mongoClientPromise;
        const db = mongoClient.db("rmManagerDev");
        const collection = db.collection("block");

        const result = await collection.insertOne(block);

        return NextResponse.json({ message: "Sessions saved" }, {status: 200});

    } catch (e) {
        console.log(e);
        return NextResponse.json({ message: "Failed to save exercises", status: 500 });
    }
}