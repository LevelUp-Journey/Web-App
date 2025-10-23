import type { Comment, Post } from "../entities/post.entity";
import type { CommentResponse, PostResponse } from "./post.response";

export class PostAssembler {
    public static toEntityFromResponse(response: PostResponse): Post {
        return {
            id: response.id,
            communityId: response.communityId,
            authorId: response.authorId,
            title: response.title,
            content: response.content,
            imageUrl: response.imageUrl,
            createdAt: response.createdAt,
            comments: response.comments.map((comment) => ({
                id: comment.id,
                authorId: comment.authorId,
                content: comment.content,
                imageUrl: comment.imageUrl,
                createdAt: comment.createdAt,
            })),
            reactions: response.reactions
                ? response.reactions.map((reaction) => ({
                      id: reaction.id,
                      postId: reaction.postId,
                      userId: reaction.userId,
                      reactionType: reaction.reactionType,
                      createdAt: reaction.createdAt,
                  }))
                : [],
        };
    }

    public static toEntitiesFromResponse(responses: PostResponse[]): Post[] {
        return responses.map((response) =>
            PostAssembler.toEntityFromResponse(response),
        );
    }
}
