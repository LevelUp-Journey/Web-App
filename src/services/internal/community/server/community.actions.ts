"use server";

import {
    COMMUNITY_HTTP,
    type RequestFailure,
    type RequestSuccess,
} from "@/services/axios.config";

export interface CreateCommunityRequest {
    ownerId: string;
    name: string;
    description: string;
    imageUrl?: string;
}

export interface CommunityResponse {
    id: string;
    ownerId: string;
    name: string;
    description: string;
    imageUrl?: string;
    createdAt: string;
}

export async function createCommunityAction(
    request: CreateCommunityRequest,
): Promise<RequestSuccess<CommunityResponse> | RequestFailure> {
    try {
        const response = await COMMUNITY_HTTP.post("/communities", request);

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

export async function getCommunitiesAction(): Promise<
    RequestSuccess<CommunityResponse[]> | RequestFailure
> {
    try {
        const response = await COMMUNITY_HTTP.get("/communities");

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

export async function getCommunityByIdAction(
    communityId: string,
): Promise<RequestSuccess<CommunityResponse> | RequestFailure> {
    try {
        const response = await COMMUNITY_HTTP.get(`/communities/${communityId}`);

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