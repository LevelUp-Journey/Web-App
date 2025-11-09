"use server";

import type { AxiosError } from "axios";
import {
    API_GATEWAY_HTTP,
    type RequestFailure,
    type RequestSuccess,
} from "@/services/axios.config";
import type {
    ChallengeResponse,
    CreateChallengeRequest,
    UpdateChallengeRequest,
} from "../controller/challenge.response";

export async function getPublicChallengesAction(): Promise<
    RequestSuccess<ChallengeResponse[]> | RequestFailure
> {
    try {
        const challenges =
            await API_GATEWAY_HTTP.get<ChallengeResponse[]>("/challenges");

        return {
            data: challenges.data,
            status: challenges.status,
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

export async function getChallengeByIdAction(
    challengeId: string,
): Promise<RequestSuccess<ChallengeResponse> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.get<ChallengeResponse>(
            `/challenges/${challengeId}`,
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

export async function createChallengeAction(
    request: CreateChallengeRequest,
): Promise<RequestSuccess<ChallengeResponse> | RequestFailure> {
    try {
        console.log("Request DE CREATION ACTION", request);
        const response = await API_GATEWAY_HTTP.post<ChallengeResponse>(
            "/challenges",
            request,
        );
        console.log("RESPONSE DE CREATION ACTION", response);

        return {
            data: response.data,
            status: response.status,
        };
    } catch (error: unknown) {
        const axiosError = error as AxiosError<{ message: string }>;
        return {
            data: String(
                (axiosError.response?.data?.message as string) ||
                    "Unknown error",
            ),
            status: axiosError.response?.status || 500,
        };
    }
}

export async function getChallengesByTeacherIdAction(
    teacherId: string,
): Promise<RequestSuccess<ChallengeResponse[]> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.get<ChallengeResponse[]>(
            `/challenges/teachers/${teacherId}`,
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

export async function updateChallengeAction(
    challengeId: string,
    request: UpdateChallengeRequest,
): Promise<RequestSuccess<ChallengeResponse> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.patch<ChallengeResponse>(
            `/challenges/${challengeId}`,
            request,
        );

        return {
            data: response.data,
            status: response.status,
        };
    } catch (error: unknown) {
        const axiosError = error as AxiosError<{ message?: string }>;
        return {
            data: String(
                (axiosError.response?.data?.message as string) ||
                    "Unknown error",
            ),
            status: axiosError.response?.status || 500,
        };
    }
}

export async function deleteChallengeAction(
    challengeId: string,
): Promise<RequestSuccess<true> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.delete(
            `/challenges/${challengeId}`,
        );

        console.log("DELETE CHALLENGE RESPONSE", response);

        return {
            data: true,
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
export async function addGuideToChallenge(
    challengeId: string,
    guideId: string,
) {
    try {
        const response = await API_GATEWAY_HTTP.post(
            `/challenges/${challengeId}/guides/${guideId}`,
        );
        console.log("ADD GUIDE TO CHALLENGE RESPONSE", response);

        return {
            data: true,
            status: response.status,
        };
    } catch (error: unknown) {
        const axiosError = error as AxiosError<{ message?: string }>;
        return {
            data: String(
                axiosError.response?.data?.message ||
                    axiosError.message ||
                    "Unknown error",
            ),
            status: axiosError.response?.status || 500,
        };
    }
}

export async function removeGuideFromChallenge(
    challengeId: string,
    guideId: string,
) {
    try {
        const response = await API_GATEWAY_HTTP.delete(
            `/challenges/${challengeId}/guides/${guideId}`,
        );
        console.log("REMOVE GUIDE FROM CHALLENGE RESPONSE", response);

        return {
            data: true,
            status: response.status,
        };
    } catch (error: unknown) {
        const axiosError = error as AxiosError<{ message?: string }>;
        return {
            data: String(
                axiosError.response?.data?.message ||
                    axiosError.message ||
                    "Unknown error",
            ),
            status: axiosError.response?.status || 500,
        };
    }
}
