"use server";

import {
    API_GATEWAY_HTTP,
    type RequestFailure,
    type RequestSuccess,
} from "@/services/axios.config";
import type { Reaction, ReactionCount, CreateReactionRequest } from "../entities/reaction.entity";

export async function createReactionAction(
    postId: string,
    request: CreateReactionRequest,
): Promise<RequestSuccess<Reaction> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.post(
            `/posts/${postId}/reactions`,
            request,
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

export async function deleteReactionAction(
    postId: string,
): Promise<RequestSuccess<void> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.delete(
            `/posts/${postId}/reactions`,
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

export async function getReactionCountsAction(
    postId: string,
): Promise<RequestSuccess<ReactionCount> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.get(
            `/posts/${postId}/reactions/count`,
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

export async function getUserReactionAction(
    postId: string,
): Promise<RequestSuccess<Reaction> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.get(
            `/posts/${postId}/reactions/me`,
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
