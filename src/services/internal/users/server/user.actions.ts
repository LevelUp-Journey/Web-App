"use server";

import {
    API_GATEWAY_HTTP,
    type RequestFailure,
    type RequestSuccess,
} from "@/services/axios.config";
import type { UserResponse } from "../controller/user.response";

export async function getUserByIdAction(
    id: string,
): Promise<RequestSuccess<UserResponse> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.get<UserResponse>(
            `/users/${id}`,
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

export async function getUserByUsernameAction(
    username: string,
): Promise<RequestSuccess<UserResponse> | RequestFailure> {
    try {
        const response = await API_GATEWAY_HTTP.get<UserResponse>(
            `/users/username/${username}`,
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
