import type { Reaction } from "../entities/reaction.entity";
import {
    type CreateReactionRequest,
    createReactionAction,
    deleteReactionAction,
    getReactionsByPostIdAction,
} from "../server/reaction.actions";

export class ReactionController {
    static async createReaction(
        request: CreateReactionRequest,
    ): Promise<Reaction> {
        const response = await createReactionAction(request);

        if (response.status !== 200 && response.status !== 201) {
            // Provide more specific error messages
            const errorMessage =
                typeof response.data === "string"
                    ? response.data
                    : "Unknown error";
            if (errorMessage.includes("ReactionId must be a valid UUID")) {
                throw new Error(
                    "Unable to create reaction due to server configuration issue. Please try again later.",
                );
            }
            throw new Error(`Failed to create reaction: ${errorMessage}`);
        }

        return response.data as Reaction;
    }

    static async getReactionsByPostId(postId: string): Promise<Reaction[]> {
        const response = await getReactionsByPostIdAction(postId);

        // getReactionsByPostIdAction will return empty list with status 200 for 400 responses
        if (response.status !== 200) {
            throw new Error(`Failed to fetch reactions: ${response.data}`);
        }

        return response.data as Reaction[];
    }

    static async deleteReaction(reactionId: string): Promise<void> {
        const response = await deleteReactionAction(reactionId);

        if (response.status !== 200 && response.status !== 204) {
            throw new Error(`Failed to delete reaction: ${response.data}`);
        }
    }
}
