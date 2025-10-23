"use server";

import {
    COMPETITIVE_HTTP,
    type RequestFailure,
    type RequestSuccess,
} from "@/services/axios.config";
import type { CompetitiveProfile } from "../entities/competitive-profile.entity";

export async function getCompetitiveProfileAction(
    userId: string,
): Promise<RequestSuccess<CompetitiveProfile> | RequestFailure> {
    try {
        const response = await COMPETITIVE_HTTP.get<CompetitiveProfile>(
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

export async function getUsersByRankAction(
    rank: string,
): Promise<RequestSuccess<CompetitiveProfile[]> | RequestFailure> {
    try {
        const response = await COMPETITIVE_HTTP.get<CompetitiveProfile[]>(
            `/competitive/profiles/rank/${rank}`,
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