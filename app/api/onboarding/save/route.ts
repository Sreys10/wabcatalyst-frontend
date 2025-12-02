import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import UserProfile from "@/models/UserProfile";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        await connectDB();

        // Find or create UserProfile
        const userProfile = await UserProfile.findOneAndUpdate(
            { userId: session.user.id },
            {
                userId: session.user.id,
                email: session.user.email,
                ...data,
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        // If step 4 (Resume) is completed or skipped (implied by calling this endpoint with final step data)
        // We can also check a flag in 'data' if we want to be explicit, e.g., { isFinalStep: true }
        if (data.isFinalStep) {
            await User.findByIdAndUpdate(session.user.id, { onboardingCompleted: true });
        }

        return NextResponse.json({ success: true, profile: userProfile });
    } catch (error) {
        console.error("Error saving onboarding data:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
