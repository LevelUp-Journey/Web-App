import { NextResponse } from "next/server";
import { PostController } from "@/services/internal/community/controller/post.controller";
import type { CreatePostRequest } from "@/services/internal/community/server/post.actions";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as CreatePostRequest;

        // Validate required fields
        if (!body.content || !body.communityId) {
            return NextResponse.json(
                {
                    error: "Missing required fields: content, communityId",
                },
                { status: 400 },
            );
        }

        // Create the post (authorId and authorProfileId will be resolved from JWT in backend)
        const post = await PostController.createPost(body);

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json(
            { error: "Failed to create post" },
            { status: 500 },
        );
    }
}
