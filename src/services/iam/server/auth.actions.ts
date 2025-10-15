"use server";

import type { AxiosError } from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CONSTS } from "@/lib/consts";
import { PATHS } from "@/lib/paths";
import {
    IAM_HTTP,
    type RequestFailure,
    type RequestSuccess,
} from "../../axios.config";
import type {
    SignInRequest,
    SignInResponse,
    SignUpRequest,
    SignUpResponse,
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

export async function saveAuthTokenAction(token: string) {
    const cookieStore = await cookies();
    cookieStore.set(CONSTS.AUTH_TOKEN_KEY, token);
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

    return token;
}
