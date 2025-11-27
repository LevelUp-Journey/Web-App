import { NextResponse } from "next/server";
import { PostController } from "@/services/internal/community/controller/post.controller";

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ postId: string }> },
) {
    try {
        const { postId } = await params;

        if (!postId) {
            return NextResponse.json(
                { error: "Post ID is required" },
                { status: 400 },
            );
        }

        // Delete functionality is not supported in the current API
        return NextResponse.json(
            { error: "Post deletion is not supported" },
            { status: 405 },
        );
    } catch (error) {
        console.error("Error deleting post:", error);
        return NextResponse.json(
            { error: "Failed to delete post" },
            { status: 500 },
        );
    }
}
