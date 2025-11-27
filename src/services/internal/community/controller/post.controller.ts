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

        // Handle API response - it returns an array of posts directly
        const apiData = response.data as unknown as Array<Record<string, unknown>>;
        const posts: Post[] = Array.isArray(apiData)
            ? apiData.map((item) => {
                  const postId =
                      (item.postId as string | undefined) ||
                      (item.id as string | undefined) ||
                      "";

                  return {
                      ...item,
                      postId,
                      communityId: (item.communityId as string) ?? "",
                      authorId: (item.authorId as string) ?? "",
                      content: (item.content as string) ?? "",
                      images: (item.images as string[] | undefined) ?? [],
                      createdAt: (item.createdAt as string) ?? "",
                      updatedAt: (item.updatedAt as string) ?? "",
                      reactions: (item.reactions ??
                          item.reactionCounts ??
                          item.reaction_count) as Post["reactions"],
                  } as Post;
              })
            : [];

        return {
            posts,
            total: posts.length,
            page: 0, // API doesn't seem to support pagination yet
            limit,
            totalPages: 1, // API doesn't seem to support pagination yet
        };
    }

    static async createPost(
        communityId: string,
        request: CreatePostRequest,
    ): Promise<Post> {
        const response = await createPostAction(communityId, request);

        if (response.status !== 201) {
            let errorMessage = "Unknown error";
            if (typeof response.data === "string") {
                errorMessage = response.data;
            } else if (response.data && typeof response.data === "object") {
                errorMessage = JSON.stringify(response.data);
            }
            console.error("Failed to create post:", errorMessage, response);
            throw new Error(`Failed to create post: ${errorMessage}`);
        }

        return response.data as Post;
    }
}
