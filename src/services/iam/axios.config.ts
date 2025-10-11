import axios from "axios";
import { CONSTS } from "@/lib/consts";
import { ENV } from "@/lib/env";

export const IAM_HTTP = axios.create({
    baseURL: ENV.SERVICES.IAM.BASE_URL,
});

[IAM_HTTP].forEach((httpClient) => {
    httpClient.interceptors.request.use((config) => {
        const token = localStorage.getItem(CONSTS.AUTH_TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
});
