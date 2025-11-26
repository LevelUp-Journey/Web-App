import type { Reaction, ReactionCount, CreateReactionRequest } from "../entities/reaction.entity";
import {
    createReactionAction,
    deleteReactionAction,
    getReactionCountsAction,
    getUserReactionAction,
} from "../server/reaction.actions";

export class ReactionController {
    static async createReaction(
        postId: string,
        request: CreateReactionRequest,
    ): Promise<Reaction | null> {
        const response = await createReactionAction(postId, request);

        if (response.status === 201) {
            return response.data as Reaction;
        }

        const errorMessage =
            typeof response.data === "string" ? response.data : "Unknown error";
        throw new Error(`Failed to create reaction: ${errorMessage}`);
    }

    static async deleteReaction(postId: string): Promise<boolean> {
        const response = await deleteReactionAction(postId);

        if (response.status === 204) {
            return true;
        }

        if (response.status === 404) {
            console.warn("No reaction found for this post");
            return false;
        }

        const errorMessage =
            typeof response.data === "string" ? response.data : "Unknown error";
        throw new Error(`Failed to delete reaction: ${errorMessage}`);
    }

    static async getReactionCounts(postId: string): Promise<ReactionCount> {
        const response = await getReactionCountsAction(postId);

        if (response.status === 200) {
            return response.data as ReactionCount;
        }

        const errorMessage =
            typeof response.data === "string" ? response.data : "Unknown error";
        throw new Error(`Failed to get reaction counts: ${errorMessage}`);
    }

    static async getUserReaction(postId: string): Promise<Reaction | null> {
        const response = await getUserReactionAction(postId);

        if (response.status === 200) {
            return response.data as Reaction;
        }

        if (response.status === 404) {
            return null; // User hasn't reacted to this post
        }

        const errorMessage =
            typeof response.data === "string" ? response.data : "Unknown error";
        throw new Error(`Failed to get user reaction: ${errorMessage}`);
    }
}
