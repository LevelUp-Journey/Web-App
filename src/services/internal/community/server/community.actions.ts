"use server";

import {
    API_GATEWAY_HTTP,
    type RequestFailure,
    type RequestSuccess,
} from "@/services/axios.config";

export interface CreateCommunityRequest {
    name: string;
    description: string;
    imageUrl?: string;
}

export interface UpdateCommunityRequest {
    name: string;
    description: string;
    imageUrl?: string;
}

export interface CommunityResponse {
    id: string;
    ownerId: string;
    ownerProfileId: string;
    name: string;
    description: string;
    imageUrl?: string;
    createdAt: string;
    followerCount?: number;
}

export async function createCommunityAction(
    request: CreateCommunityRequest,
): Promise<RequestSuccess<CommunityResponse> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.post("/communities", request);

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
        const response = await API_GATEWAY_HTTP.get("/communities");

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
        const response = await API_GATEWAY_HTTP.get(
            `/communities/${communityId}`,
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

export async function updateCommunityAction(
    communityId: string,
    request: UpdateCommunityRequest,
): Promise<RequestSuccess<CommunityResponse> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.put(
            `/communities/${communityId}`,
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

export async function getCommunitiesByCreatorAction(
    creatorUserId: string,
): Promise<RequestSuccess<CommunityResponse[]> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.get(
            `/communities/creator/${creatorUserId}`,
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

export async function deleteCommunityAction(
    communityId: string,
): Promise<RequestSuccess<void> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.delete(
            `/communities/${communityId}`,
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
