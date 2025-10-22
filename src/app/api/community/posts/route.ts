import { NextResponse } from "next/server";
import { PostController } from "@/services/internal/community/controller/post.controller";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { ProfileController } from "@/services/internal/profiles/controller/profile.controller";
import type { CreatePostRequest } from "@/services/internal/community/server/post.actions";

export async function POST(request: Request) {
    try {
        const body = await request.json() as CreatePostRequest;

        // Validate required fields
        if (!body.title || !body.content || !body.communityId) {
            return NextResponse.json(
                { error: "Missing required fields: title, content, communityId" },
                { status: 400 }
            );
        }

        // Get the authenticated user's ID
        const userId = await AuthController.getUserId();

        // Get the user's profile
        const profile = await ProfileController.getProfileByUserId(userId);

        // Override authorId with authenticated user's ID and add authorProfileId
        const postData: CreatePostRequest = {
            ...body,
            authorId: userId,
            authorProfileId: profile.id,
        };

        console.log("Creating post with data:", postData);

        // Create the post
        const post = await PostController.createPost(postData);

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json(
            { error: "Failed to create post" },
            { status: 500 }
        );
    }
}
