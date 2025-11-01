"use server";

import type { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CONSTS, type UserRole } from "@/lib/consts";
import { PATHS } from "@/lib/paths";
import {
    IAM_HTTP,
    type RequestFailure,
    type RequestSuccess,
} from "../../../axios.config";
import type {
    JWTPayload,
    RefreshTokenResponse,
    SearchUsersRequest,
    SignInRequest,
    SignInResponse,
    SignUpRequest,
    SignUpResponse,
    UserSearchResult,
} from "../controller/auth.response";

export async function signInAction(
    request: SignInRequest,
): Promise<RequestSuccess<SignInResponse> | RequestFailure> {
    try {
        const response = await IAM_HTTP.post<SignInResponse>(
            "/authentication/sign-in",
            request,
        );

        return {
            status: response.status,
            data: response.data,
        } as RequestSuccess<SignInResponse>;
    } catch (e) {
        const error = e as AxiosError;
        return {
            data: error.message,
            status: error.status,
        };
    }
}

export async function signUpAction(request: SignUpRequest) {
    try {
        const response = await IAM_HTTP.post<SignUpResponse>(
            "/authentication/sign-up",
            request,
        );

        return {
            status: response.status,
            data: response.data,
        } as RequestSuccess<SignUpResponse>;
    } catch (e) {
        const error = e as AxiosError;
        return {
            data: error.message,
            status: error.status,
        };
    }
}

export async function signOutAction() {
    const cookieStore = await cookies();
    cookieStore.delete(CONSTS.AUTH_TOKEN_KEY);
    redirect(PATHS.ROOT);
}

export async function saveAuthTokenAction(token: string, refreshToken: string) {
    const cookieStore = await cookies();
    cookieStore.set(CONSTS.AUTH_TOKEN_KEY, token);
    cookieStore.set(CONSTS.AUTH_REFRESH_TOKEN_KEY, refreshToken);
}

export async function saveOAuthTokenAction(
    token: string,
    refreshToken?: string,
) {
    const cookieStore = await cookies();
    cookieStore.set(CONSTS.AUTH_TOKEN_KEY, token);
    if (refreshToken) {
        cookieStore.set(CONSTS.AUTH_REFRESH_TOKEN_KEY, refreshToken);
    }
}

export async function validateTokenAction() {
    try {
        // auth token already applied in @/src/services/axios.config.ts
        await IAM_HTTP.get("/authentication/validate");

        return true;
    } catch {
        // Only where its being used then user must be signed out
        return false;
    }
}

export async function getAuthTokenAction() {
    const cookieStore = await cookies();
    const token =
        cookieStore.get(CONSTS.AUTH_TOKEN_KEY)?.value || "NO_TOKEN_FOUND";
    const refreshToken =
        cookieStore.get(CONSTS.AUTH_REFRESH_TOKEN_KEY)?.value ||
        "NO_REFRESH_TOKEN_FOUND";

    return { token, refreshToken };
}

export async function getUserRolesFromTokenAction(): Promise<UserRole[]> {
    const authToken = await getAuthTokenAction();

    const decoded = jwtDecode<{ roles: UserRole[] }>(authToken.token);
    const roles = decoded.roles as UserRole[];

    return roles;
}

export async function refreshTokenAction() {
    const response = await IAM_HTTP.post<RefreshTokenResponse>(
        "/authentication/refresh",
    );

    return {
        status: response.status,
        data: response.data,
    };
}

export async function getUserIdFromTokenAction(): Promise<string> {
    try {
        const decoded = await decodeJWT();
        if (!decoded.userId) {
            throw new Error("No userId found in token");
        }
        return decoded.userId;
    } catch (error) {
        console.error(
            "getUserIdFromTokenAction: failed to decode token:",
            error,
        );
        throw error;
    }
}

export async function decodeJWT() {
    const authToken = await getAuthTokenAction();
    if (authToken.token === "NO_TOKEN_FOUND") {
        throw new Error("No authentication token found");
    }
    const decoded = jwtDecode<JWTPayload>(authToken.token);
    return decoded;
}

export async function searchUsersAction(
    request: SearchUsersRequest,
): Promise<UserSearchResult[]> {
    try {
        const response = await IAM_HTTP.get<UserSearchResult[]>(
            "/api/v1/profiles/search",
            {
                params: {
                    username: request.username,
                },
            },
        );

        return response.data;
    } catch (e) {
        const error = e as AxiosError;
        console.error("Error searching users:", error);
        return [];
    }
}
