"use server";

import { LEARNING_HTTP } from "@/services/axios.config";
import type { LearningResponse } from "../../shared";
import type {
    CreateGuideRequest,
    CreatePageRequest,
    DeleteGuideRequest,
    DeletePageRequest,
    GetGuidePagesByGuideIdRequest,
    GetPageByIdRequest,
    GuideResponse,
    UpdateGuideRequest,
    UpdateGuideStatusRequest,
    UpdatePageRequest,
} from "../controller/guide.response";

interface GetGuidesResponseFomat {
    content: GuideResponse[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    numberOfElements: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    empty: boolean;
}

export async function getAllGuidesAction(): Promise<GuideResponse[]> {
    const response =
        await LEARNING_HTTP.get<LearningResponse<GetGuidesResponseFomat>>(
            "/guides",
        );
    return response.data.data.content;
}

export async function createGuideAction(
    request: CreateGuideRequest,
): Promise<GuideResponse> {
    const response = await LEARNING_HTTP.post<GuideResponse>(
        "/guides",
        request,
    );
    return response.data;
}

export async function getGuideByIdAction(
    guideId: string,
): Promise<GuideResponse> {
    const response = await LEARNING_HTTP.get<GuideResponse>(
        `/guides/${guideId}`,
    );
    return response.data;
}

export async function updateGuideAction(
    guideId: string,
    request: UpdateGuideRequest,
): Promise<GuideResponse> {
    const response = await LEARNING_HTTP.put<GuideResponse>(
        `/guides/${guideId}`,
        request,
    );
    return response.data;
}

export async function deleteGuideAction(
    request: DeleteGuideRequest,
): Promise<void> {
    await LEARNING_HTTP.delete(`/guides/${request.id}`);
}

export async function updateGuideStatusAction(
    guideId: string,
    request: UpdateGuideStatusRequest,
): Promise<GuideResponse> {
    const response = await LEARNING_HTTP.patch<GuideResponse>(
        `/guides/${guideId}/status`,
        request,
    );
    return response.data;
}

// Page-related actions
export async function getGuidePagesByGuideIdAction(
    request: GetGuidePagesByGuideIdRequest,
): Promise<GuideResponse> {
    const response = await LEARNING_HTTP.get<GuideResponse>(
        `/guides/${request.guideId}/pages`,
    );
    return response.data;
}

export async function createPageAction(
    guideId: string,
    request: CreatePageRequest,
): Promise<GuideResponse> {
    const response = await LEARNING_HTTP.post<GuideResponse>(
        `/guides/${guideId}/pages`,
        request,
    );
    return response.data;
}

export async function getPageByIdAction(
    request: GetPageByIdRequest,
): Promise<GuideResponse> {
    const response = await LEARNING_HTTP.get<GuideResponse>(
        `/guides/${request.guideId}/pages/${request.pageId}`,
    );
    return response.data;
}

export async function updatePageAction(
    guideId: string,
    pageId: string,
    request: UpdatePageRequest,
): Promise<GuideResponse> {
    const response = await LEARNING_HTTP.put<GuideResponse>(
        `/guides/${guideId}/pages/${pageId}`,
        request,
    );
    return response.data;
}

export async function deletePageAction(
    request: DeletePageRequest,
): Promise<GuideResponse> {
    const response = await LEARNING_HTTP.delete<GuideResponse>(
        `/guides/${request.guideId}/pages/${request.pageId}`,
    );
    return response.data;
}
