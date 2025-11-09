import { type NextRequest, NextResponse } from "next/server";
import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ profileId: string }> },
) {
    try {
        const { profileId } = await params;
        const profile = await ProfileController.getProfileByUserId(profileId);

        return NextResponse.json(profile);
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json(
            { error: "Profile not found" },
            { status: 404 },
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ profileId: string }> },
) {
    try {
        const { profileId } = await params;
        const body = await request.json();

        const updatedProfile = await ProfileController.updateProfileByUserId(
            profileId,
            body,
        );

        return NextResponse.json(updatedProfile);
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json(
            { error: "Failed to update profile" },
            { status: 500 },
        );
    }
}
