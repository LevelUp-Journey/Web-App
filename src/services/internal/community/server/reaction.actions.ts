"use server";

import {
    API_GATEWAY_HTTP,
    type RequestFailure,
    type RequestSuccess,
} from "@/services/axios.config";
import type { Reaction } from "../entities/reaction.entity";

export interface CreateReactionRequest {
    postId: string;
    userId: string;
    reactionType: "LIKE";
}

export async function createReactionAction(
    request: CreateReactionRequest,
): Promise<RequestSuccess<Reaction> | RequestFailure> {
    try {
        // Use new endpoint: POST /reactions/user/{userId}/post/{postId}
        const response = await API_GATEWAY_HTTP.post(
            `/reactions/user/${request.userId}/post/${request.postId}`,
        );

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

export async function getReactionsByPostIdAction(
    postId: string,
): Promise<RequestSuccess<Reaction[]> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.get(
            `/reactions/post/${postId}`,
        );

        return {
            data: response.data,
            status: response.status,
        };
    } catch (error: unknown) {
        const axiosError = error as {
            response?: { data?: unknown; status?: number };
            message?: string;
        };
        // If backend returns 400 for this endpoint, treat it as no reactions (non-fatal)
        if (axiosError.response?.status === 400) {
            return {
                data: [] as Reaction[],
                status: 200,
            };
        }

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

export async function deleteReactionAction(
    userId: string,
    postId: string,
): Promise<RequestSuccess<void> | RequestFailure> {
    try {
        // Use new endpoint: DELETE /reactions/user/{userId}/post/{postId}
        const response = await API_GATEWAY_HTTP.delete(
            `/reactions/user/${userId}/post/${postId}`,
        );

        return {
            data: undefined,
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
