import { NextResponse, NextRequest } from "next/server";
import mongoClientPromise from "@/lib/mongodb";
import {dbName} from "@/lib/mongodb";

export async function DELETE(req: NextRequest) {
    try {
        const { id } = await req.json();

        if (!id || typeof id !== "string") {
            return NextResponse.json({ message: "Invalid Block ID format" }, { status: 400 });
        }

        const mongoClient = await mongoClientPromise;
        const db = mongoClient.db(dbName);
        const collection = db.collection("blocks");

        // Utilise `id` pour la suppression
        const result = await collection.deleteOne({ id });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: "Block not found" }, { status: 404 });
        }

        console.log("Block deleted successfully");

        return NextResponse.json({ message: "Block deleted successfully" }, { status: 200 });
    } catch (e) {
        console.error("Error deleting block:", e);
        return NextResponse.json({ message: "Failed to delete Block" }, { status: 500 });
    }
}
