"use server";

import { API_GATEWAY_HTTP } from "@/services/axios.config";
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

export interface GetGuidesPaginatedRequest {
    page?: number;
    size?: number;
    sort?: string;
}

export interface GetGuidesResponseFormat {
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
    try {
        console.log(API_GATEWAY_HTTP);
        const response =
            await API_GATEWAY_HTTP.get<
                LearningResponse<GetGuidesResponseFormat>
            >("/guides");
        return response.data.data.content;
    } catch (error) {
        console.error("Error fetching all guides:", error);
        return [];
    }
}

export async function getGuidesPaginatedAction(
    request?: GetGuidesPaginatedRequest,
): Promise<GetGuidesResponseFormat | null> {
    try {
        const params = new URLSearchParams();
        if (request?.page !== undefined)
            params.append("page", String(request.page));
        if (request?.size !== undefined)
            params.append("size", String(request.size));
        if (request?.sort) params.append("sort", request.sort);

        const response = await API_GATEWAY_HTTP.get<
            LearningResponse<GetGuidesResponseFormat>
        >(`/guides${params.toString() ? `?${params.toString()}` : ""}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching paginated guides:", error);
        return null;
    }
}

export async function getTeachersGuidesAction(
    teacherId: string,
): Promise<GuideResponse[]> {
    try {
        const response = await API_GATEWAY_HTTP.get<
            LearningResponse<GetGuidesResponseFormat>
        >(`/guides/teachers/${teacherId}`);
        return response.data.data.content;
    } catch (error) {
        console.error("Error fetching teacher's guides:", error);
        return [];
    }
}

export async function getTeachersGuidesPaginatedAction(
    teacherId: string,
    request?: GetGuidesPaginatedRequest,
): Promise<GetGuidesResponseFormat> {
    const params = new URLSearchParams();
    if (request?.page !== undefined)
        params.append("page", String(request.page));
    if (request?.size !== undefined)
        params.append("size", String(request.size));
    if (request?.sort) params.append("sort", request.sort);

    const response = await API_GATEWAY_HTTP.get<
        LearningResponse<GetGuidesResponseFormat>
    >(
        `/guides/teachers/${teacherId}${params.toString() ? `?${params.toString()}` : ""}`,
    );
    return response.data.data;
}

export async function createGuideAction(
    request: CreateGuideRequest,
): Promise<GuideResponse> {
    const response = await API_GATEWAY_HTTP.post<
        LearningResponse<GuideResponse>
    >("/guides", request);
    return response.data.data;
}

export async function getGuideByIdAction(
    guideId: string,
): Promise<GuideResponse | null> {
    try {
        const response = await API_GATEWAY_HTTP.get<
            LearningResponse<GuideResponse>
        >(`/guides/${guideId}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching guide ${guideId}:`, error);
        return null;
    }
}

export async function updateGuideAction(
    guideId: string,
    request: UpdateGuideRequest,
): Promise<GuideResponse> {
    const response = await API_GATEWAY_HTTP.put<
        LearningResponse<GuideResponse>
    >(`/guides/${guideId}`, request);
    return response.data.data;
}

export async function deleteGuideAction(
    request: DeleteGuideRequest,
): Promise<void> {
    await API_GATEWAY_HTTP.delete(`/guides/${request.id}`);
}

export async function updateGuideStatusAction(
    guideId: string,
    request: UpdateGuideStatusRequest,
): Promise<GuideResponse> {
    const response = await API_GATEWAY_HTTP.put<
        LearningResponse<GuideResponse>
    >(`/guides/${guideId}/status`, request);
    return response.data.data;
}

// Page-related actions
export async function getGuidePagesByGuideIdAction(
    request: GetGuidePagesByGuideIdRequest,
): Promise<GuideResponse> {
    const response = await API_GATEWAY_HTTP.get<
        LearningResponse<GuideResponse>
    >(`/guides/${request.guideId}/pages`);
    return response.data.data;
}

export async function createPageAction(
    guideId: string,
    request: CreatePageRequest,
): Promise<GuideResponse> {
    const response = await API_GATEWAY_HTTP.post<
        LearningResponse<GuideResponse>
    >(`/guides/${guideId}/pages`, request);
    return response.data.data;
}

export async function getPageByIdAction(
    request: GetPageByIdRequest,
): Promise<GuideResponse> {
    const response = await API_GATEWAY_HTTP.get<
        LearningResponse<GuideResponse>
    >(`/guides/${request.guideId}/pages/${request.pageId}`);
    return response.data.data;
}

export async function updatePageAction(
    guideId: string,
    pageId: string,
    request: UpdatePageRequest,
): Promise<GuideResponse> {
    const response = await API_GATEWAY_HTTP.put<
        LearningResponse<GuideResponse>
    >(`/guides/${guideId}/pages/${pageId}`, request);
    return response.data.data;
}

export async function deletePageAction(
    request: DeletePageRequest,
): Promise<GuideResponse> {
    const response = await API_GATEWAY_HTTP.delete<
        LearningResponse<GuideResponse>
    >(`/guides/${request.guideId}/pages/${request.pageId}`);
    return response.data.data;
}
