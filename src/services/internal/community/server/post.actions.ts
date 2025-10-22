"use server";

import {
    COMMUNITY_HTTP,
    type RequestFailure,
    type RequestSuccess,
} from "@/services/axios.config";
import type { PostResponse } from "../controller/post.response";

export async function getAllPostsAction(): Promise<
    RequestSuccess<PostResponse[]> | RequestFailure
> {
    try {
        const response = await COMMUNITY_HTTP.get("/posts");

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

export async function getUserFeedPostsAction(
    userId: string,
    limit: number = 20,
    offset: number = 0,
): Promise<RequestSuccess<PostResponse[]> | RequestFailure> {
    try {
        const response = await COMMUNITY_HTTP.get(
            `/posts/feed/${userId}?limit=${limit}&offset=${offset}`,
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

export interface CreatePostRequest {
    communityId: string;
    authorId: string;
    title: string;
    content: string;
    imageUrl?: string;
}

export async function createPostAction(
    request: CreatePostRequest,
): Promise<RequestSuccess<PostResponse> | RequestFailure> {
    try {
        const response = await COMMUNITY_HTTP.post("/posts", request);

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