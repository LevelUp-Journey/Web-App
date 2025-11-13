"use server";

import {
    API_GATEWAY_HTTP,
    type RequestFailure,
    type RequestSuccess,
} from "@/services/axios.config";

export interface SubscriptionResponse {
    id: string;
    userId: string;
    communityId: string;
    communityName: string;
    communityImageUrl?: string;
    createdAt: string;
}

export interface PaginatedSubscriptionResponse {
    content: SubscriptionResponse[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface CreateSubscriptionRequest {
    communityId: string;
}

export async function createSubscriptionAction(
    request: CreateSubscriptionRequest,
): Promise<RequestSuccess<SubscriptionResponse> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.post("/subscriptions", request);

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
    subscriptionId: string,
): Promise<RequestSuccess<void> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.delete(
            `/subscriptions/${subscriptionId}`,
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
): Promise<RequestSuccess<SubscriptionResponse[]> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.get(
            `/subscriptions/community/${communityId}`,
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

export async function getSubscriptionsByUserAction(
    userId: string,
    page: number = 0,
    size: number = 20,
): Promise<RequestSuccess<PaginatedSubscriptionResponse> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.get(
            `/subscriptions/user/${userId}`,
            {
                params: { page, size },
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
