"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CONSTS } from "@/lib/consts";
import { PATHS } from "@/lib/paths";
import { IAM_HTTP } from "../../axios.config";
import type {
    SignInRequest,
    SignInResponse,
    SignUpRequest,
    SignUpResponse,
} from "../controller/auth.response";

export async function signInAction(request: SignInRequest) {
    const response = await IAM_HTTP.post<SignInResponse>(
        "/authentication/sign-in",
        request,
    );
    return response;
}

export async function signOutAction() {
    const cookieStore = await cookies();
    cookieStore.delete(CONSTS.AUTH_TOKEN_KEY);
    redirect(PATHS.ROOT);
}

export async function saveAuthToken(token: string) {
    const cookieStore = await cookies();
    cookieStore.set(CONSTS.AUTH_TOKEN_KEY, token);
}

export async function signUpAction(request: SignUpRequest) {
    await IAM_HTTP.post<SignUpResponse>("/authentication/sign-up", request);

    await signInAction({
        email: request.email,
        password: request.password,
    });
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
