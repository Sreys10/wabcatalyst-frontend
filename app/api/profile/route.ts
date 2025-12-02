import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Profile from "@/models/Profile";
import User from "@/models/User";

export async function GET(req: Request) {
    try {
        await connectDB();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const session: any = await getServerSession(authOptions as any);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Find user by email to get ID
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const user = await (User as any).findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const profile = await (Profile as any).findOne({ userId: user._id });

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        return NextResponse.json(profile);
    } catch (error) {
        console.error("Profile GET Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const session: any = await getServerSession(authOptions as any);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();

        // Find user by email to get ID
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const user = await (User as any).findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Upsert profile
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const profile = await (Profile as any).findOneAndUpdate(
            { userId: user._id },
            {
                userId: user._id,
                ...data
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json(profile);
    } catch (error) {
        console.error("Profile POST Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
