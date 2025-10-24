"use server";

import {
    CHALLENGES_HTTP,
    type RequestFailure,
    type RequestSuccess,
} from "@/services/axios.config";
import type {
    CodeVersionResponse,
    CreateCodeVersionRequest,
    UpdateCodeVersionRequest,
} from "../controller/code-version.response";

export async function getCodeVersionByIdAction(
    challengeId: string,
    codeVersionId: string,
): Promise<RequestSuccess<CodeVersionResponse> | RequestFailure> {
    const data = await CHALLENGES_HTTP.get<CodeVersionResponse>(
        `/challenges/${challengeId}/code-versions/${codeVersionId}`,
    );

    return {
        data: data.data,
        status: data.status,
    };
}

export async function getCodeVersionsByChallengeIdAction(
    challengeId: string,
): Promise<RequestSuccess<CodeVersionResponse[]> | RequestFailure> {
    const data = await CHALLENGES_HTTP.get<CodeVersionResponse[]>(
        `/challenges/${challengeId}/code-versions`,
    );

    return {
        data: data.data,
        status: data.status,
    };
}

export async function createCodeVersionAction(
    challengeId: string,
    request: CreateCodeVersionRequest,
): Promise<RequestSuccess<CodeVersionResponse> | RequestFailure> {
    try {
        const response = await CHALLENGES_HTTP.post<CodeVersionResponse>(
            `/challenges/${challengeId}/code-versions`,
            request,
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

export async function updateCodeVersionAction(
    challengeId: string,
    codeVersionId: string,
    request: UpdateCodeVersionRequest,
): Promise<RequestSuccess<CodeVersionResponse> | RequestFailure> {
    try {
        const response = await CHALLENGES_HTTP.put<CodeVersionResponse>(
            `/challenges/${challengeId}/code-versions/${codeVersionId}`,
            request,
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

export async function deleteCodeVersionAction(
    challengeId: string,
    codeVersionId: string,
): Promise<RequestSuccess<void> | RequestFailure> {
    try {
        const response = await CHALLENGES_HTTP.delete(
            `/challenges/${challengeId}/code-versions/${codeVersionId}`,
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
