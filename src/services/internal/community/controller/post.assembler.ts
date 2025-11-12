import type { Comment, Post } from "../entities/post.entity";
import type { CommentResponse, PostResponse } from "./post.response";

export class PostAssembler {
    public static toEntityFromResponse(response: PostResponse): Post {
        return {
            id: response.id,
            communityId: response.communityId,
            authorId: response.authorId,
            authorProfileId: response.authorProfileId,
            authorName: response.authorName, // username from backend
            authorProfileUrl: response.authorProfileUrl, // profile URL from backend
            content: response.content,
            imageUrl: response.imageUrl ?? null,
            createdAt: response.createdAt,
            comments: response.comments
                ? response.comments.map((comment) => ({
                      id: comment.id,
                      authorId: comment.authorId,
                      authorProfileId: comment.authorProfileId,
                      content: comment.content,
                      imageUrl: comment.imageUrl ?? null,
                      createdAt: comment.createdAt,
                  }))
                : [],
            reactions: {
                reactionCounts: response.reactions?.reactionCounts || {},
                userReaction: response.reactions?.userReaction || null,
            },
        };
    }

    public static toEntitiesFromResponse(responses: PostResponse[]): Post[] {
        return responses.map((response) =>
            PostAssembler.toEntityFromResponse(response),
        );
    }
}
