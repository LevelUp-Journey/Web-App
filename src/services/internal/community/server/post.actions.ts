"use server";

import {
    API_GATEWAY_HTTP,
    type RequestFailure,
    type RequestSuccess,
} from "@/services/axios.config";
import type { Post, CreatePostRequest, PostsListResponse } from "../entities/post.entity";

export async function getPostsByCommunityIdAction(
    communityId: string,
    offset = 0,
    limit = 20,
): Promise<RequestSuccess<PostsListResponse> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.get(
            `/communities/${communityId}/posts`,
            {
                params: { offset, limit },
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

export async function createPostAction(
    communityId: string,
    request: CreatePostRequest,
): Promise<RequestSuccess<Post> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.post(
            `/communities/${communityId}/posts`,
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
