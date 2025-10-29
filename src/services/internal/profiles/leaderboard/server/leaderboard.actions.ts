"use server";

import {
    PROFILES_HTTP,
    type RequestFailure,
    type RequestSuccess,
} from "@/services/axios.config";
import type { LeaderboardEntry, LeaderboardResponse } from "../entities/leaderboard.entity";

export async function getLeaderboardAction(
    limit: number = 50,
    offset: number = 0,
): Promise<RequestSuccess<LeaderboardEntry[]> | RequestFailure> {
    try {
        const response = await PROFILES_HTTP.get<LeaderboardEntry[]>(
            `/leaderboard?limit=${limit}&offset=${offset}`,
        );
        return { data: response.data, status: response.status };
    } catch (error: unknown) {
        const axiosError = error as {
            response?: { data?: unknown; status?: number };
            message?: string;
        };

        let errorMessage = axiosError.message || "Unknown error";

        if (axiosError.response?.data) {
            if (typeof axiosError.response.data === "string") {
                errorMessage = axiosError.response.data;
            } else if (typeof axiosError.response.data === "object") {
                errorMessage = JSON.stringify(axiosError.response.data);
            }
        }

        return {
            data: errorMessage,
            status: axiosError.response?.status || 500,
        };
    }
}

export async function getUserPositionAction(
    userId: string,
): Promise<RequestSuccess<LeaderboardEntry> | RequestFailure> {
    try {
        const response = await PROFILES_HTTP.get<LeaderboardEntry>(
            `/leaderboard/user/${userId}`,
        );
        return { data: response.data, status: response.status };
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

export async function getTop500Action(): Promise<
    RequestSuccess<LeaderboardResponse> | RequestFailure
> {
    try {
        const response =
            await PROFILES_HTTP.get<LeaderboardResponse>(`/leaderboard/top500`);
        return { data: response.data, status: response.status };
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

export async function getUsersByRankAction(
    rank: string,
): Promise<RequestSuccess<LeaderboardEntry[]> | RequestFailure> {
    try {
        const response = await PROFILES_HTTP.get<LeaderboardEntry[]>(
            `/competitive/profiles/rank/${rank.toUpperCase()}`,
        );
        return { data: response.data, status: response.status };
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

export async function recalculateLeaderboardAction(): Promise<
    RequestSuccess<void> | RequestFailure
> {
    try {
        const response = await PROFILES_HTTP.post<void>(
            `/leaderboard/recalculate`,
        );
        return { data: response.data, status: response.status };
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
