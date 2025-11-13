"use server";

import {
    API_GATEWAY_HTTP,
    type RequestFailure,
    type RequestSuccess,
} from "@/services/axios.config";
import type {
    PaginatedPostsResponse,
    PostResponse,
} from "../controller/post.response";

export async function getAllPostsAction(): Promise<
    RequestSuccess<PostResponse[]> | RequestFailure
> {
    try {
        const response = await API_GATEWAY_HTTP.get("/posts");

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

export async function getPostsByCommunityIdAction(
    communityId: string,
    page = 0,
    size = 20,
): Promise<RequestSuccess<PaginatedPostsResponse> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.get(
            `/posts/community/${communityId}`,
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

export async function getPostsByUserIdAction(
    userId: string,
): Promise<RequestSuccess<PostResponse[]> | RequestFailure> {
    try {
        // For now, get all posts and filter by authorId
        // TODO: Replace with specific endpoint when available
        const response = await API_GATEWAY_HTTP.get("/posts");
        const allPosts = response.data as PostResponse[];
        const userPosts = allPosts.filter((post) => post.authorId === userId);

        return {
            data: userPosts,
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

export async function getFeedPostsAction(
    userId: string,
    limit = 20,
    offset = 0,
): Promise<RequestSuccess<PostResponse[]> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.get(`/posts/feed/${userId}`, {
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

export interface CreatePostRequest {
    communityId: string;
    content: string;
    imageUrl?: string | null;
}

export async function createPostAction(
    request: CreatePostRequest,
): Promise<RequestSuccess<PostResponse> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.post("/posts", request);

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

export async function deletePostAction(
    postId: string,
): Promise<RequestSuccess<void> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.delete(`/posts/${postId}`);

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
