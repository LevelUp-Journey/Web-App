"use server";

import { API_GATEWAY_HTTP } from "@/services/axios.config";

export async function sendSuggestionAction(suggestion: string): Promise<void> {
    try {
        const response = await API_GATEWAY_HTTP.post("/suggestions", {
            comment: suggestion,
        });

        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
