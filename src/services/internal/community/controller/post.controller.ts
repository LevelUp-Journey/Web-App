import { PostAssembler } from "./post.assembler";
import {
    getAllPostsAction,
    getPostsByUserIdAction,
    createPostAction,
    type CreatePostRequest,
} from "../server/post.actions";
import type { Post } from "../entities/post.entity";
import type { PostResponse } from "./post.response";

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

    static async getPostsByUserId(userId: string): Promise<Post[]> {
        const response = await getPostsByUserIdAction(userId);

        if (response.status !== 200) {
            throw new Error(`Failed to fetch posts by user: ${response.data}`);
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
}
