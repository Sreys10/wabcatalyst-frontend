import { getServerSession } from "next-auth";
import { authOptions } from "@lib/auth";
import User from "@models/User";
import { connectDB } from "@lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        const { role, experience, goals } = data;

        // Basic validation
        if (!role || !experience) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        await connectDB();

        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email },
            {
                $set: {
                    onboardingCompleted: true,
                    onboardingData: {
                        role,
                        experience,
                        goals,
                        completedAt: new Date(),
                    },
                },
            },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(
            { message: "Onboarding completed successfully", user: updatedUser },
            { status: 200 }
        );
    } catch (error) {
        console.error("Onboarding error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
