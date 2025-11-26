import { NextResponse } from "next/server";
import { PostController } from "@/services/internal/community/controller/post.controller";
import type { CreatePostRequest } from "@/services/internal/community/entities/post.entity";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as CreatePostRequest;

        // Validate required fields
        if (!body.content) {
            return NextResponse.json(
                {
                    error: "Missing required field: content",
                },
                { status: 400 },
            );
        }

        // Extract communityId from body (it should be there for backward compatibility)
        const { communityId, ...postData } = body as any;

        if (!communityId) {
            return NextResponse.json(
                {
                    error: "Missing required field: communityId",
                },
                { status: 400 },
            );
        }

        // Create the post
        const post = await PostController.createPost(communityId, postData);

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json(
            { error: "Failed to create post" },
            { status: 500 },
        );
    }
}
