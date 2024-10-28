import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mongoClientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
    try {
        const { username, firstName, lastName, password, roles, referent } = await req.json();
        console.log({ username, firstName, lastName, password, roles, referent });

        if (!username || !password || !firstName || !lastName || !roles || !referent) {
            return NextResponse.json({ message: "All fields are required" +
                    `username=${username}, password=${password}, firstName=${firstName}, lastName=${lastName}, roles=${roles}, referent=${referent}`
            });
        }

        const mongoClient = await mongoClientPromise;
        const db = mongoClient.db("rmManagerProd");
        const usersCollection = db.collection("users");

        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            return NextResponse.json({ message: "User already exist" });
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const result = await usersCollection.insertOne({ username, roles: Number(roles), referent, firstName, lastName, password: hashedPass });

        return NextResponse.json({ message: "User registered", userId: result.insertedId }, {status: 201});
    }
    catch (error) {
        console.error("Error during registration", error);
        return NextResponse.json({ message: "Internal server error" }, {status: 500});
    }
}
