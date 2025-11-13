"use server";

import axios from "axios";
import { ENV } from "@/lib/env";
import {
    type RequestFailure,
    type RequestSuccess,
} from "@/services/axios.config";
import { getAuthTokenAction } from "../../iam/server/auth.actions";
import type { FeedResponse } from "../controller/feed.response";

// Create a separate axios instance for the feed service
const FEED_HTTP = axios.create({
    baseURL: "http://100.123.160.27:8086/api/v1",
});

FEED_HTTP.interceptors.request.use(async (config) => {
    const authTokens = await getAuthTokenAction();
    if (authTokens && authTokens.token !== "NO_TOKEN_FOUND") {
        config.headers.Authorization = `Bearer ${authTokens.token}`;
    }
    return config;
});

export async function getUserFeedAction(
    userId: string,
    limit = 20,
    offset = 0,
): Promise<RequestSuccess<FeedResponse> | RequestFailure> {
    try {
        const response = await FEED_HTTP.get(`/feed/${userId}`, {
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
