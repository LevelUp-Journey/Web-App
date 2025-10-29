"use server";
import axios from "axios";
import { CONSTS } from "@/lib/consts";
import { ENV } from "@/lib/env";
import { getAuthTokenAction } from "./internal/iam/server/auth.actions";

export const IAM_HTTP = axios.create({
    baseURL: ENV.SERVICES.IAM.BASE_URL,
});

export const CHALLENGES_HTTP = axios.create({
    baseURL: ENV.SERVICES.CHALLENGES.BASE_URL,
});

export const COMMUNITY_HTTP = axios.create({
    baseURL: ENV.SERVICES.COMMUNITY.BASE_URL,
});

export const PROFILES_HTTP = axios.create({
    baseURL: ENV.SERVICES.PROFILE.BASE_URL,
});

export const LEARNING_HTTP = axios.create({
    baseURL: ENV.SERVICES.LEARNING.BASE_URL,
});

[
    IAM_HTTP,
    CHALLENGES_HTTP,
    COMMUNITY_HTTP,
    PROFILES_HTTP,
    LEARNING_HTTP,
].forEach((httpClient) => {
    httpClient.interceptors.request.use(async (config) => {
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
});

export interface RequestFailure {
    data: string;
    status?: number;
}

export interface RequestSuccess<T> {
    data: T;
    status?: number;
}
