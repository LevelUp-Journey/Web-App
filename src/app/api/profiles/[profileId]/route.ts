import { NextRequest, NextResponse } from "next/server";
import { ProfileController } from "@/services/internal/profiles/controller/profile.controller";

export async function GET(
    request: NextRequest,
    { params }: { params: { profileId: string } },
) {
    try {
        const profile = await ProfileController.getProfileByUserId(params.profileId);

        return NextResponse.json(profile);
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json(
            { error: "Profile not found" },
            { status: 404 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { profileId: string } },
) {
    try {
        const body = await request.json();

        const updatedProfile = await ProfileController.updateProfileByUserId(
            params.profileId,
            body
        );

        return NextResponse.json(updatedProfile);
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json(
            { error: "Failed to update profile" },
            { status: 500 }
        );
    }
}