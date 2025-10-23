"use server";

import {
    SCORES_HTTP,
    type RequestFailure,
    type RequestSuccess,
} from "@/services/axios.config";
import type { Score } from "../entities/score.entity";

export async function getAllScoresAction(): Promise<RequestSuccess<Score[]> | RequestFailure> {
    try {
        const response = await SCORES_HTTP.get<Score[]>(
            `/scores`,
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

export async function getScoresByUserIdAction(
    userId: string,
): Promise<RequestSuccess<Score[]> | RequestFailure> {
    try {
        const response = await SCORES_HTTP.get<Score[]>(
            `/scores/user/${userId}`,
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

export async function getTotalPointsByUserIdAction(
    userId: string,
): Promise<RequestSuccess<number> | RequestFailure> {
    try {
        const response = await SCORES_HTTP.get<number>(
            `/scores/user/${userId}/total`,
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