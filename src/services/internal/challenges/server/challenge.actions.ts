"use server";

import {
    CHALLENGES_HTTP,
    type RequestFailure,
    type RequestSuccess,
} from "@/services/axios.config";
import type {
    ChallengeResponse,
    CreateChallengeRequest,
} from "../controller/challenge.response";

export async function getPublicChallengesAction(): Promise<
    RequestSuccess<ChallengeResponse[]> | RequestFailure
> {
    const challenges =
        await CHALLENGES_HTTP.get<ChallengeResponse[]>("/challenges");

    return {
        data: challenges.data,
        status: challenges.status,
    };
}

export async function getChallengeByIdAction(
    challengeId: string,
): Promise<RequestSuccess<ChallengeResponse> | RequestFailure> {
    try {
        const response = await CHALLENGES_HTTP.get<ChallengeResponse>(
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
        const response = await CHALLENGES_HTTP.post<ChallengeResponse>(
            "/challenges",
            request,
        );
        console.log("RESPONSE DE CREATION ACTION", response);

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

export async function getChallengesByTeacherIdAction(
    teacherId: string,
): Promise<RequestSuccess<ChallengeResponse[]> | RequestFailure> {
    try {
        const response = await CHALLENGES_HTTP.get<ChallengeResponse[]>(
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
