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
    ): Promise<boolean> {
        const response = await createReactionAction(request);

        // 201 = Created successfully
        if (response.status === 201) {
            return true;
        }

        // 409 = User already has a reaction (conflict)
        if (response.status === 409) {
            console.warn("User already has a reaction on this post");
            return false;
        }
        
        // Other errors
        const errorMessage =
            typeof response.data === "string"
                ? response.data
                : "Unknown error";
        throw new Error(`Failed to create reaction: ${errorMessage}`);
    }

    static async getReactionsByPostId(postId: string): Promise<Reaction[]> {
        const response = await getReactionsByPostIdAction(postId);

        // getReactionsByPostIdAction will return empty list with status 200 for 400 responses
        if (response.status !== 200) {
            throw new Error(`Failed to fetch reactions: ${response.data}`);
        }

        return response.data as Reaction[];
    }

    static async deleteReaction(userId: string, postId: string): Promise<boolean> {
        const response = await deleteReactionAction(userId, postId);

        // 204 = Deleted successfully
        if (response.status === 204 || response.status === 200) {
            return true;
        }

        // 404 = No reaction found
        if (response.status === 404) {
            console.warn("No reaction found for this user on this post");
            return false;
        }

        throw new Error(`Failed to delete reaction: ${response.data}`);
    }
}
