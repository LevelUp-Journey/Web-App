"use server";

import type { RequestFailure, RequestSuccess } from "@/services/axios.config";
import { API_GATEWAY_HTTP } from "@/services/axios.config";
import type { ReactionType } from "../entities/reaction.entity";

export interface FeedItemReactions {
    reactionCounts: Partial<Record<string, number>> &
        Partial<Record<ReactionType | Uppercase<ReactionType>, number>>;
    userReaction: string | null;
}

export interface FeedItem {
    id: string;
    communityId: string;
    communityName: string;
    communityImageUrl: string | null;
    authorId: string;
    authorProfileId?: string;
    authorName: string;
    authorProfileUrl: string | null;
    content: string;
    imageUrl: string | null;
    createdAt: string;
    updatedAt?: string;
    reactions: FeedItemReactions;
}

export interface FeedApiItem {
    postId: string;
    communityId: string;
    authorId: string;
    content: string;
    messageType?: string;
    createdAt: string;
    updatedAt?: string;
    imageUrl?: string | null;
    communityName?: string;
    communityImageUrl?: string | null;
    authorName?: string;
    authorProfileUrl?: string | null;
    authorProfileId?: string;
    reactions?: FeedItemReactions;
    reactionCounts?: FeedItemReactions["reactionCounts"];
    userReaction?: string | null;
    [key: string]: unknown;
}

export interface FeedApiResponse {
    items: FeedApiItem[];
    total: number;
    limit?: number;
    offset?: number;
}

export interface FeedResponse {
    items: FeedItem[];
    total: number;
    limit: number;
    offset: number;
}

export async function getUserFeedAction(
    limit = 20,
    offset = 0,
): Promise<RequestSuccess<FeedApiResponse> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.get(`/feed`, {
            params: { limit, offset },
        });

        return {
            data: response.data,
            status: response.status,
        };
    } catch (error: unknown) {
        const axiosError = error as {
            response?: { data?: unknown; status?: number };
            message?: string;
        };
        return {
            data: String(
                axiosError.response?.data ||
                    axiosError.message ||
                    "Unknown error",
            ),
            status: axiosError.response?.status || 500,
        };
    }
}
