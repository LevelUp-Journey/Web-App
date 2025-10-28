"use server";

import { LEARNING_HTTP } from "@/services/axios.config";
import type {
    CreateGuideRequest,
    GuideResponse,
} from "../controller/guide.response";

export async function createGuideAction(request: CreateGuideRequest) {
    const response = await LEARNING_HTTP.post<GuideResponse>(
        "/guides",
        request,
    );
    return response.data;
}

export async function getGuideAction(id: string) {
    const response = await LEARNING_HTTP.get<GuideResponse>(`/guides/${id}`);
    return response.data;
}

export async function getAllGuidesAction() {
    const response = await LEARNING_HTTP.get<GuideResponse[]>("/guides");
    return response.data;
}
