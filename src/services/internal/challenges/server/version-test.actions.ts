"use server";

import {
    CHALLENGES_HTTP,
    type RequestFailure,
    type RequestSuccess,
} from "@/services/axios.config";
import type { VersionTestResponse } from "../controller/versions-test.response";

export interface CreateVersionTestRequest {
    input: string;
    expectedOutput: string;
    customValidationCode?: string;
    failureMessage?: string;
}

export interface UpdateVersionTestRequest {
    input?: string;
    expectedOutput?: string;
    customValidationCode?: string;
    failureMessage?: string;
}

export async function getVersionTestByIdAction(
    challengeId: string,
    codeVersionId: string,
    testId: string,
): Promise<RequestSuccess<VersionTestResponse> | RequestFailure> {
    const data = await CHALLENGES_HTTP.get<VersionTestResponse>(
        `/challenges/${challengeId}/code-versions/${codeVersionId}/tests/${testId}`,
    );

    return {
        data: data.data,
        status: data.status,
    };
}

export async function getVersionTestsByChallengeIdAndCodeVersionIdAction(
    challengeId: string,
    codeVersionId: string,
): Promise<RequestSuccess<VersionTestResponse[]> | RequestFailure> {
    const data = await CHALLENGES_HTTP.get<VersionTestResponse[]>(
        `/challenges/${challengeId}/code-versions/${codeVersionId}/tests`,
    );

    return {
        data: data.data,
        status: data.status,
    };
}

export async function createVersionTestAction(
    challengeId: string,
    codeVersionId: string,
    request: CreateVersionTestRequest,
): Promise<RequestSuccess<VersionTestResponse> | RequestFailure> {
    try {
        const response = await CHALLENGES_HTTP.post<VersionTestResponse>(
            `/challenges/${challengeId}/code-versions/${codeVersionId}/tests`,
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

export async function updateVersionTestAction(
    challengeId: string,
    codeVersionId: string,
    testId: string,
    request: UpdateVersionTestRequest,
): Promise<RequestSuccess<VersionTestResponse> | RequestFailure> {
    try {
        const response = await CHALLENGES_HTTP.put<VersionTestResponse>(
            `/challenges/${challengeId}/code-versions/${codeVersionId}/tests/${testId}`,
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

export async function deleteVersionTestAction(
    challengeId: string,
    codeVersionId: string,
    testId: string,
): Promise<RequestSuccess<void> | RequestFailure> {
    try {
        const response = await CHALLENGES_HTTP.delete(
            `/challenges/${challengeId}/code-versions/${codeVersionId}/tests/${testId}`,
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
