"use server";

import {
    API_GATEWAY_HTTP,
    type RequestFailure,
    type RequestSuccess,
} from "@/services/axios.config";
import type {
    Subscription,
    SubscriptionCount,
    SubscriptionListResponse,
} from "../entities/subscription.entity";

export async function createSubscriptionAction(
    communityId: string,
): Promise<RequestSuccess<Subscription> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.post(
            `/communities/${communityId}/subscriptions`,
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

export async function deleteSubscriptionAction(
    communityId: string,
): Promise<RequestSuccess<void> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.delete(
            `/communities/${communityId}/subscriptions`,
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

export async function getSubscriptionsByCommunityAction(
    communityId: string,
    page: number = 0,
    limit: number = 20,
): Promise<RequestSuccess<SubscriptionListResponse> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.get(
            `/communities/${communityId}/subscriptions`,
            {
                params: { page, limit },
            },
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

export async function getSubscriptionCountAction(
    communityId: string,
): Promise<RequestSuccess<SubscriptionCount> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.get(
            `/communities/${communityId}/subscriptions/count`,
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

export async function getUserSubscriptionForCommunityAction(
    communityId: string,
): Promise<RequestSuccess<Subscription> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.get(
            `/communities/${communityId}/subscriptions/me`,
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
