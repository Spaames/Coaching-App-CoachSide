import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mongoClientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
    try {
        const { username, firstName, lastName, password } = await req.json();
        if (!username || !password || !firstName || !lastName) {
            return NextResponse.json({ message: "All fields are required"});
        }

        const mongoClient = await mongoClientPromise;
        const db = mongoClient.db("rmManagerDev");
        const usersCollection = db.collection("users");

        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            return NextResponse.json({ message: "User already exist" });
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const result = await usersCollection.insertOne({ username, firstName, lastName, password: hashedPass });

        return NextResponse.json({ message: "User registered", userId: result.insertedId }, {status: 201});
    }
    catch (error) {
        console.error("Error during registration", error);
        return NextResponse.json({ message: "Internal server error" }, {status: 500});
    }
}
