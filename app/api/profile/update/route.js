import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@lib/auth";
import connectDB from "@lib/db";
import UserProfile from "@models/UserProfile";
import { sanitizeProfilePayload, toUserObjectId } from "@lib/profile";

export async function PUT(request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in." },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    const body = await request.json();
    const sanitizedPayload = sanitizeProfilePayload(body);
    const userObjectId = toUserObjectId(session.user);

    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId: userObjectId },
      {
        ...sanitizedPayload,
        email: session.user.email,
        legacyUserId: session.user.id,
      },
      { new: true, upsert: false }
    );

    if (!updatedProfile) {
      return NextResponse.json(
        { error: "Profile not found for this user." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, profile: updatedProfile },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update failed:", error);
    return NextResponse.json(
      { error: "Failed to update profile." },
      { status: 500 }
    );
  }
}









