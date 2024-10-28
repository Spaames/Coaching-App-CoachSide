import { NextResponse, NextRequest } from "next/server";
import mongoClientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
    try {
        const block = await req.json();

        if (!block) {
            return NextResponse.json({ message: "No block found" }, {status: 400});
        }

        const mongoClient = await mongoClientPromise;
        const db = mongoClient.db("rmManagerProd");
        const collection = db.collection("blocks");

        const result = await collection.insertOne(block);

        return NextResponse.json({ message: "Block Saved" }, {status: 200});

    } catch (e) {
        console.log(e);
        return NextResponse.json({ message: "Failed to save Block", status: 500 });
    }
}