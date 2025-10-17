"use server";
import axios from "axios";
import { ENV } from "@/lib/env";
import { getAuthTokenAction } from "./internal/iam/server/auth.actions";

export const IAM_HTTP = axios.create({
    baseURL: ENV.SERVICES.IAM.BASE_URL,
});

export const PROFILE_HTTP = axios.create({
    baseURL: ENV.SERVICES.PROFILE.BASE_URL,
});

export const CHALLENGES_HTTP = axios.create({
    baseURL: ENV.SERVICES.CHALLENGES.BASE_URL,
});

[IAM_HTTP, PROFILE_HTTP, CHALLENGES_HTTP].forEach((httpClient) => {
    httpClient.interceptors.request.use(async (config) => {
        const token = await getAuthTokenAction();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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
