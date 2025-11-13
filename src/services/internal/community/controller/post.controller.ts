import type { Post } from "../entities/post.entity";
import {
    type CreatePostRequest,
    createPostAction,
    deletePostAction,
    getAllPostsAction,
    getFeedPostsAction,
    getPostsByCommunityIdAction,
    getPostsByUserIdAction,
} from "../server/post.actions";
import { PostAssembler } from "./post.assembler";
import type { PaginatedPostsResponse, PostResponse } from "./post.response";

export class PostController {
    static async getAllPosts(): Promise<Post[]> {
        const response = await getAllPostsAction();

        if (response.status !== 200) {
            throw new Error(`Failed to fetch posts: ${response.data}`);
        }

        return PostAssembler.toEntitiesFromResponse(
            response.data as PostResponse[],
        );
    }

    static async getPostsByCommunityId(
        communityId: string,
        page = 0,
        size = 20,
    ) {
        const response = await getPostsByCommunityIdAction(
            communityId,
            page,
            size,
        );

        if (response.status !== 200) {
            throw new Error(`Failed to fetch posts: ${response.data}`);
        }

        const paginatedData = response.data as PaginatedPostsResponse;

        return {
            posts: PostAssembler.toEntitiesFromResponse(paginatedData.content),
            hasNext: paginatedData.hasNext,
            totalElements: paginatedData.totalElements,
            totalPages: paginatedData.totalPages,
            currentPage: paginatedData.page,
        };
    }

    static async getPostsByUserId(userId: string): Promise<Post[]> {
        const response = await getPostsByUserIdAction(userId);

        if (response.status !== 200) {
            throw new Error(`Failed to fetch posts by user: ${response.data}`);
        }

        return PostAssembler.toEntitiesFromResponse(
            response.data as PostResponse[],
        );
    }

    static async getFeedPosts(
        userId: string,
        limit = 20,
        offset = 0,
    ): Promise<Post[]> {
        const response = await getFeedPostsAction(userId, limit, offset);

        if (response.status !== 200) {
            throw new Error(`Failed to fetch feed posts: ${response.data}`);
        }

        return PostAssembler.toEntitiesFromResponse(
            response.data as PostResponse[],
        );
    }

    static async createPost(request: CreatePostRequest): Promise<Post> {
        const response = await createPostAction(request);

        if (response.status !== 200 && response.status !== 201) {
            throw new Error(`Failed to create post: ${response.data}`);
        }

        return PostAssembler.toEntityFromResponse(
            response.data as PostResponse,
        );
    }

    static async deletePost(postId: string): Promise<void> {
        const response = await deletePostAction(postId);

        if (response.status !== 200 && response.status !== 204) {
            throw new Error(`Failed to delete post: ${response.data}`);
        }
    }
}
