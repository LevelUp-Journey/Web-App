"use server";
import axios from "axios";
import { CONSTS } from "@/lib/consts";
import { ENV } from "@/lib/env";
import { getAuthTokenAction } from "./internal/iam/server/auth.actions";

export const API_GATEWAY_HTTP = axios.create({
    baseURL: ENV.SERVICES.API_GATEWAY.BASE_URL,
});

API_GATEWAY_HTTP.interceptors.request.use(async (config) => {
    const authTokens = await getAuthTokenAction();
    if (authTokens && authTokens.token !== "NO_TOKEN_FOUND") {
        config.headers.Authorization = `Bearer ${authTokens.token}`;
        config.headers.set(
            CONSTS.AUTH_REFRESH_TOKEN_KEY,
            authTokens.refreshToken,
        );
    }
    return config;
});

export interface RequestFailure {
    data: string;
    status?: number;
}

export interface RequestSuccess<T> {
    data: T;
    status?: number;
}
