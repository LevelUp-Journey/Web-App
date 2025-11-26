import type { Post, CreatePostRequest, PostsListResponse } from "../entities/post.entity";
import type { PaginatedPostsResponse } from "./post.response";
import {
    createPostAction,
    getPostsByCommunityIdAction,
} from "../server/post.actions";

export class PostController {
    static async getPostsByCommunityId(
        communityId: string,
        offset = 0,
        limit = 20,
    ): Promise<PostsListResponse> {
        const response = await getPostsByCommunityIdAction(
            communityId,
            offset,
            limit,
        );

        if (response.status !== 200) {
            throw new Error(`Failed to fetch posts: ${response.data}`);
        }

        // Map the API response (PaginatedPostsResponse) to PostsListResponse
        const apiData = response.data as unknown as PaginatedPostsResponse;
        const posts: Post[] = (apiData.content || []).map(postResponse => ({
            postId: postResponse.id,
            communityId: postResponse.communityId,
            authorId: postResponse.authorId,
            content: postResponse.content,
            images: postResponse.imageUrl ? [postResponse.imageUrl] : [],
            type: "message" as const, // Default type, could be enhanced later
            createdAt: postResponse.createdAt,
            updatedAt: postResponse.createdAt, // Use createdAt as fallback
        }));

        return {
            posts,
            total: apiData.totalElements || 0,
            page: apiData.page || 0,
            limit: apiData.size || limit,
            totalPages: apiData.totalPages || 0,
        };
    }

    static async createPost(
        communityId: string,
        request: CreatePostRequest,
    ): Promise<Post> {
        const response = await createPostAction(communityId, request);

        if (response.status !== 201) {
            const errorMessage =
                typeof response.data === "string" ? response.data : "Unknown error";
            throw new Error(`Failed to create post: ${errorMessage}`);
        }

        return response.data as Post;
    }
}
