import { NextRequest, NextResponse} from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoClientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();
        if (!username || !password) {
            return NextResponse.json({ message: "Username and password required"});
        }
        const mongoClient = await mongoClientPromise;
        const db = mongoClient.db("rmManagerDev");
        const usersCollection = db.collection("users");

        const existingUser = await usersCollection.findOne({ username });
        if (!existingUser) {
            return NextResponse.json({ message: "User does not exist" });
        }

        const isValidPassword = bcrypt.compare(password, existingUser.password);
        if (!isValidPassword) {
            return NextResponse.json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id:existingUser.id, username: existingUser.username }, process.env.JWT_SECRET as string, {expiresIn: "1h"});

        return NextResponse.json({ message: "User logged in", token});


    } catch (error) {
        console.error("Error during registration", error);
        return NextResponse.json({ message: "Internal server error" }, {status: 500});
    }
}