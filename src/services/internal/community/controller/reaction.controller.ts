import type {
    Reaction,
    ReactionCount,
    CreateReactionRequest,
    ReactionType,
} from "../entities/reaction.entity";
import { REACTION_TYPES } from "../entities/reaction.entity";
import {
    createReactionAction,
    deleteReactionAction,
    getReactionCountsAction,
    getUserReactionAction,
} from "../server/reaction.actions";
import { reactionCache } from "../cache/reaction-cache";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";

function normalizeReaction(reaction: Reaction): Reaction {
    const normalizedType = reaction.reactionType.toLowerCase() as ReactionType;
    return { ...reaction, reactionType: normalizedType };
}

function normalizeReactionCount(raw: ReactionCount): ReactionCount {
    const normalizedCounts: Partial<Record<ReactionType, number>> = {};

    for (const type of REACTION_TYPES) {
        const count =
            raw.counts?.[type] ??
            // Some endpoints return uppercase keys
            (raw.counts as Record<string, number | undefined> | undefined)?.[
                type.toUpperCase()
            ];

        normalizedCounts[type] = count ?? 0;
    }

    const total =
        raw.totalCount ||
        Object.values(normalizedCounts).reduce(
            (acc, value) => acc + (value ?? 0),
            0,
        );

    return {
        ...raw,
        counts: normalizedCounts,
        totalCount: total,
    };
}

export class ReactionController {
    static async createReaction(
        postId: string,
        request: CreateReactionRequest,
    ): Promise<Reaction | null> {
        const response = await createReactionAction(postId, request);

        if (response.status === 201 || response.status === 200) {
            const reaction = normalizeReaction(response.data as Reaction);
            reactionCache.invalidatePost(postId);

            const userId = await this.safeGetUserId();
            if (userId) {
                reactionCache.setUserReaction(userId, postId, reaction);
            }

            return reaction;
        }

        const errorMessage =
            typeof response.data === "string" ? response.data : "Unknown error";
        throw new Error(`Failed to create reaction: ${errorMessage}`);
    }

    static async deleteReaction(postId: string): Promise<boolean> {
        const response = await deleteReactionAction(postId);

        if (response.status === 204) {
            reactionCache.invalidatePost(postId);

            const userId = await this.safeGetUserId();
            if (userId) {
                reactionCache.setUserReaction(userId, postId, null);
            }

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
        const cachedCounts = reactionCache.getCounts(postId);
        if (cachedCounts) {
            return cachedCounts;
        }

        const response = await getReactionCountsAction(postId);

        if (response.status === 200) {
            const counts = normalizeReactionCount(response.data as ReactionCount);
            reactionCache.setCounts(postId, counts);
            return counts;
        }

        const errorMessage =
            typeof response.data === "string" ? response.data : "Unknown error";
        throw new Error(`Failed to get reaction counts: ${errorMessage}`);
    }

    static async getUserReaction(postId: string): Promise<Reaction | null> {
        const userId = await this.safeGetUserId();

        if (userId) {
            const cachedUserReaction = reactionCache.getUserReaction(
                userId,
                postId,
            );
            if (cachedUserReaction !== undefined) {
                return cachedUserReaction;
            }
        }

        const response = await getUserReactionAction(postId);

        if (response.status === 200) {
            const reaction = normalizeReaction(response.data as Reaction);
            if (userId) {
                reactionCache.setUserReaction(userId, postId, reaction);
            }
            return reaction;
        }

        if (response.status === 404) {
            if (userId) {
                reactionCache.setUserReaction(userId, postId, null);
            }
            return null; // User hasn't reacted to this post
        }

        const errorMessage =
            typeof response.data === "string" ? response.data : "Unknown error";
        throw new Error(`Failed to get user reaction: ${errorMessage}`);
    }

    private static async safeGetUserId(): Promise<string | null> {
        try {
            const userId = await AuthController.getUserId();
            return userId;
        } catch (error) {
            console.warn("ReactionController: could not resolve user id", error);
            return null;
        }
    }
}
