"use server";

import {
    API_GATEWAY_HTTP,
    type RequestFailure,
    type RequestSuccess,
} from "@/services/axios.config";
import type {
    CompetitiveProfile,
    UsersByRankResponse,
} from "../entities/competitive-profile.entity";

export async function getCompetitiveProfileAction(
    userId: string,
): Promise<RequestSuccess<CompetitiveProfile> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.get<CompetitiveProfile>(
            `/competitive/profiles/user/${userId}`,
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

export async function syncCompetitiveProfileAction(
    userId: string,
): Promise<RequestSuccess<CompetitiveProfile> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.post<CompetitiveProfile>(
            `/competitive/profiles/user/${userId}/sync`,
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

export async function getUsersByRankAction(
    rank: string,
    offset: number = 0,
): Promise<RequestSuccess<UsersByRankResponse> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.get<UsersByRankResponse>(
            `/competitive/profiles/rank/${rank}`,
            {
                params: { offset },
            },
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
