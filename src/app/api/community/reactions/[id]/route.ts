import { type NextRequest, NextResponse } from "next/server";
// import { ReactionController } from "@/services/internal/community/controller/reaction.controller";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";

/**
 * DELETE /api/community/reactions/[id]
 * DEPRECATED: Use DELETE /api/community/reactions with postId in body instead
 * This endpoint is no longer needed with the new backend API
 */
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const userId = await AuthController.getUserId();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        return NextResponse.json(
            { error: "This endpoint is deprecated. Use DELETE /api/community/reactions with postId in body" },
            { status: 410 }, // 410 Gone
        );
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
