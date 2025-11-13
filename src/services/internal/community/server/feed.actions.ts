"use server";

import type { RequestFailure, RequestSuccess } from "@/services/axios.config";
import { API_GATEWAY_HTTP } from "@/services/axios.config";

export interface FeedItemReactions {
    reactionCounts: {
        LIKE?: number;
    };
    userReaction: string | null;
}

export interface FeedItem {
    id: string;
    communityId: string;
    communityName: string;
    communityImageUrl: string | null;
    authorId: string;
    authorProfileId: string;
    authorName: string;
    authorProfileUrl: string | null;
    content: string;
    imageUrl: string | null;
    createdAt: string;
    reactions: FeedItemReactions;
}

export interface FeedResponse {
    content: FeedItem[];
    page: number;
    size: number;
    totalElements: number;
}

export async function getUserFeedAction(
    userId: string,
    limit = 20,
    offset = 0,
): Promise<RequestSuccess<FeedResponse> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.get(`/feed/${userId}`, {
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
