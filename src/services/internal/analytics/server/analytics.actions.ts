"use server";

import {
    API_GATEWAY_HTTP,
    type RequestFailure,
    type RequestSuccess,
} from "@/services/axios.config";
import type {
    DailyKPI,
    LanguageKPI,
    StudentKPI,
    TopFailedChallenge,
    TotalUsersResponse,
} from "../entities/analytics.entity";

/**
 * Get total registered users
 */
export async function getTotalUsersAction(): Promise<
    RequestSuccess<TotalUsersResponse> | RequestFailure
> {
    try {
        const response = await API_GATEWAY_HTTP.get<TotalUsersResponse>(
            `/user-registration-analytics/kpi/total-users`,
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
                    "Service unavailable",
            ),
            status: axiosError.response?.status || 503,
        };
    }
}

/**
 * Get daily KPIs
 * @param limit - Number of days to fetch (default: 30)
 */
export async function getDailyKPIsAction(
    limit: number = 30,
): Promise<RequestSuccess<DailyKPI[]> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.get<DailyKPI[]>(
            `/analytics/kpi/daily`,
            {
                params: { limit },
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
                    "Service unavailable",
            ),
            status: axiosError.response?.status || 503,
        };
    }
}

/**
 * Get KPIs by programming language
 */
export async function getLanguageKPIsAction(): Promise<
    RequestSuccess<LanguageKPI[]> | RequestFailure
> {
    try {
        const response = await API_GATEWAY_HTTP.get<LanguageKPI[]>(
            `/analytics/kpi/languages`,
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
                    "Service unavailable",
            ),
            status: axiosError.response?.status || 503,
        };
    }
}

/**
 * Get KPIs for a specific student
 * @param studentId - Student ID
 */
export async function getStudentKPIsAction(
    studentId: string,
): Promise<RequestSuccess<StudentKPI> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.get<StudentKPI>(
            `/analytics/kpi/student/${studentId}`,
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
                    "Service unavailable",
            ),
            status: axiosError.response?.status || 503,
        };
    }
}

/**
 * Get top failed challenges
 * @param limit - Number of challenges to fetch
 */
export async function getTopFailedChallengesAction(
    limit: number = 10,
): Promise<RequestSuccess<TopFailedChallenge[]> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.get<TopFailedChallenge[]>(
            `/analytics/kpi/top-failed-challenges`,
            {
                params: { limit },
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
                    "Service unavailable",
            ),
            status: axiosError.response?.status || 503,
        };
    }
}
