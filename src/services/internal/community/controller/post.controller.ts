import { PostAssembler } from "./post.assembler";
import { getAllPostsAction, getUserFeedPostsAction } from "../server/post.actions";
import type { Post } from "../entities/post.entity";
import type { PostResponse } from "./post.response";

export class PostController {
    static async getAllPosts(): Promise<Post[]> {
        const response = await getAllPostsAction();

        if (response.status !== 200) {
            throw new Error(`Failed to fetch posts: ${response.data}`);
        }

        return PostAssembler.toEntitiesFromResponse(response.data as PostResponse[]);
    }

    static async getUserFeedPosts(
        userId: string,
        limit: number = 20,
        offset: number = 0,
    ): Promise<Post[]> {
        const response = await getUserFeedPostsAction(userId, limit, offset);

        if (response.status !== 200) {
            throw new Error(`Failed to fetch user feed posts: ${response.data}`);
        }

        return PostAssembler.toEntitiesFromResponse(response.data as PostResponse[]);
    }
}