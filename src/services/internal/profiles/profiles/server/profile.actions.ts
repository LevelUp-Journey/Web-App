"use server";

import {
    API_GATEWAY_HTTP,
    type RequestFailure,
    type RequestSuccess,
} from "@/services/axios.config";
import type {
    ProfileResponse,
    SearchUserResponse,
    UpdateProfileRequest,
} from "../controller/profile.response";

export async function getProfileAction(
    profileId: string,
): Promise<RequestSuccess<ProfileResponse> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.get<ProfileResponse>(
            `/profiles/user/${profileId}`,
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
                    "Profile service unavailable",
            ),
            status: axiosError.response?.status || 503,
        };
    }
}

export async function updateProfileAction(
    profileId: string,
    data: UpdateProfileRequest,
): Promise<RequestSuccess<ProfileResponse> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.put<ProfileResponse>(
            `/profiles/${profileId}`,
            data,
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
                    "Unable to update profile",
            ),
            status: axiosError.response?.status || 503,
        };
    }
}

export async function getProfileByIdAction(
    profileId: string,
): Promise<RequestSuccess<ProfileResponse> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.get<ProfileResponse>(
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

export async function getAllProfilesAction(): Promise<
    RequestSuccess<ProfileResponse[]> | RequestFailure
> {
    try {
        const response =
            await API_GATEWAY_HTTP.get<ProfileResponse[]>(`/profiles`);
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
        const response = await API_GATEWAY_HTTP.get<ProfileResponse[]>(
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

export async function searchUsersByUsernameAction(
    username: string,
): Promise<SearchUserResponse[]> {
    try {
        const response = await API_GATEWAY_HTTP.get<SearchUserResponse[]>(
            `/profiles/search?username=${username}`,
        );

        return response.data;
    } catch (error: unknown) {
        console.error("Error searching users by username:", error);
        // Return empty array on error so the app doesn't crash
        return [];
    }
}
