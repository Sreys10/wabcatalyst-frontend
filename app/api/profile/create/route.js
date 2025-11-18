import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@lib/auth";
import connectDB from "@lib/db";
import UserProfile from "@models/UserProfile";
import { sanitizeProfilePayload, toUserObjectId } from "@lib/profile";

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in." },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    const userObjectId = toUserObjectId(session.user);
    const existingProfile = await UserProfile.findOne({ userId: userObjectId });

    if (existingProfile) {
      return NextResponse.json(
        { error: "Profile already exists for this user." },
        { status: 409 }
      );
    }

    const body = await request.json();
    const sanitizedPayload = sanitizeProfilePayload(body);

    const profile = await UserProfile.create({
      ...sanitizedPayload,
      userId: userObjectId,
      legacyUserId: session.user.id,
      email: session.user.email,
    });

    return NextResponse.json(
      { success: true, profile },
      { status: 201 }
    );
  } catch (error) {
    console.error("Profile creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create profile." },
      { status: 500 }
    );
  }
}




