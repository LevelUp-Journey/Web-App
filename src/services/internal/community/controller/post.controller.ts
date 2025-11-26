import type { Post, CreatePostRequest, PostsListResponse } from "../entities/post.entity";
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

        return response.data as PostsListResponse;
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
