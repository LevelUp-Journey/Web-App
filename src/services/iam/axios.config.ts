"use server";
import axios from "axios";
import { ENV } from "@/lib/env";
import { getAuthTokenAction } from "./server/auth.actions";

export const IAM_HTTP = axios.create({
    baseURL: ENV.SERVICES.IAM.BASE_URL,
});

[IAM_HTTP].forEach((httpClient) => {
    httpClient.interceptors.request.use(async (config) => {
        const token = await getAuthTokenAction();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
});
