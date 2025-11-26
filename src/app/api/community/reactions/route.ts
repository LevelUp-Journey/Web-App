import { type NextRequest, NextResponse } from "next/server";
import { ReactionController } from "@/services/internal/community/controller/reaction.controller";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";

/**
 * POST /api/community/reactions
 * Creates a new reaction to a post using userId and postId
 */
export async function POST(request: NextRequest) {
    try {
        const userId = await AuthController.getUserId();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const body = await request.json();
        const { postId, reactionType } = body;

        if (!postId || !reactionType) {
            return NextResponse.json(
                { error: "postId and reactionType are required" },
                { status: 400 },
            );
        }

        const success = await ReactionController.createReaction(postId, {
            reactionType,
        });

        if (!success) {
            return NextResponse.json(
                { error: "User already has a reaction on this post" },
                { status: 409 },
            );
        }

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error("Error creating reaction:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}

/**
 * DELETE /api/community/reactions
 * Deletes a reaction using userId and postId from body
 */
export async function DELETE(request: NextRequest) {
    try {
        const userId = await AuthController.getUserId();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const body = await request.json();
        const { postId } = body;

        if (!postId) {
            return NextResponse.json(
                { error: "postId is required" },
                { status: 400 },
            );
        }

        const success = await ReactionController.deleteReaction(postId);

        if (!success) {
            return NextResponse.json(
                { error: "No reaction found for this user on this post" },
                { status: 404 },
            );
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error deleting reaction:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
