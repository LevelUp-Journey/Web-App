"use server";

import {
    PROFILES_HTTP,
    type RequestFailure,
    type RequestSuccess,
} from "@/services/axios.config";
import type {
    ProfileResponse,
    UpdateProfileRequest,
} from "../controller/profile.response";

export async function getProfileAction(
    profileId: string,
): Promise<RequestSuccess<ProfileResponse> | RequestFailure> {
    const response = await PROFILES_HTTP.get<ProfileResponse>(
        `/profiles/user/${profileId}`,
    );
    return { data: response.data, status: response.status };
}

export async function updateProfileAction(
    profileId: string,
    data: UpdateProfileRequest,
): Promise<RequestSuccess<ProfileResponse> | RequestFailure> {
    const response = await PROFILES_HTTP.put<ProfileResponse>(
        `/profiles/${profileId}`,
        data,
    );
    return { data: response.data, status: response.status };
}

export async function getProfileByIdAction(
    profileId: string,
): Promise<RequestSuccess<ProfileResponse> | RequestFailure> {
    try {
        const response = await PROFILES_HTTP.get<ProfileResponse>(
            `/profiles/${profileId}`,
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

export async function searchProfilesAction(
    query: string,
): Promise<RequestSuccess<ProfileResponse[]> | RequestFailure> {
    try {
        const response = await PROFILES_HTTP.get<ProfileResponse[]>(
            `/profiles/search?q=${encodeURIComponent(query)}`,
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
