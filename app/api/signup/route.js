import { NextResponse } from "next/server";
import { createUser } from "../../../lib/users";

export async function POST(req) {
    try {
        const { email, password, name } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        const user = await createUser(email, password, name);
        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create account" },
            { status: 500 }
        );
    }
}
