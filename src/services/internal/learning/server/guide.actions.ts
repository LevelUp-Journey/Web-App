"use server";

import type { AxiosError } from "axios";
import { revalidatePath } from "next/cache";
import {
    LEARNING_HTTP,
    type RequestFailure,
    type RequestSuccess,
} from "../../../axios.config";
import type {
    ChangeGuideStatusRequest,
    CreateGuideRequest,
    GetGuideListParams,
    GuideListResponse,
    GuideResponse,
    UpdateGuideRequest,
} from "../controller/guide.response";

// CREATE
export async function createGuideAction(
    data: CreateGuideRequest,
): Promise<RequestSuccess<GuideResponse> | RequestFailure> {
    try {
        const requestBody = {
            courseId: data.courseId,
            title: data.title,
            description: data.description,
            markdownContent: data.markdownContent,
        };

        const response = await LEARNING_HTTP.post<GuideResponse>(
            "/guides",
            requestBody,
        );

        revalidatePath("/guides");
        return {
            status: response.status,
            data: response.data,
        } as RequestSuccess<GuideResponse>;
    } catch (e) {
        const error = e as AxiosError;
        return {
            data: error.message,
            status: error.status,
        };
    }
}

// READ
export async function getGuideByIdAction(
    id: string,
): Promise<RequestSuccess<GuideResponse> | RequestFailure> {
    try {
        const response = await LEARNING_HTTP.get<GuideResponse>(
            `/guides/${id}`,
        );

        return {
            status: response.status,
            data: response.data,
        } as RequestSuccess<GuideResponse>;
    } catch (e) {
        const error = e as AxiosError;
        return {
            data: error.message,
            status: error.status,
        };
    }
}

export async function getGuidesByCourseAction(
    courseId: string,
): Promise<RequestSuccess<GuideResponse[]> | RequestFailure> {
    try {
        const response = await LEARNING_HTTP.get<GuideResponse[]>(
            `/guides/course/${courseId}`,
        );

        return {
            status: response.status,
            data: response.data,
        } as RequestSuccess<GuideResponse[]>;
    } catch (e) {
        const error = e as AxiosError;
        return {
            data: error.message,
            status: error.status,
        };
    }
}

export async function getGuideListAction(
    params?: GetGuideListParams,
): Promise<RequestSuccess<GuideResponse[]> | RequestFailure> {
    try {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.courseId) queryParams.append("courseId", params.courseId);
        if (params?.authorId) queryParams.append("authorId", params.authorId);

        const url =
            params && Object.keys(params).length > 0
                ? `/guides?${queryParams}`
                : "/guides";

        const response = await LEARNING_HTTP.get<GuideResponse[]>(url);

        return {
            status: response.status,
            data: response.data,
        } as RequestSuccess<GuideResponse[]>;
    } catch (e) {
        const error = e as AxiosError;
        return {
            data: error.message,
            status: error.status,
        };
    }
}

// UPDATE
export async function updateGuideAction(
    id: string,
    data: UpdateGuideRequest,
): Promise<RequestSuccess<GuideResponse> | RequestFailure> {
    try {
        const requestBody = {
            title: data.title,
            description: data.description,
            markdownContent: data.markdownContent,
        };

        const response = await LEARNING_HTTP.put<GuideResponse>(
            `/guides/${id}`,
            requestBody,
        );

        revalidatePath("/guides");
        return {
            status: response.status,
            data: response.data,
        } as RequestSuccess<GuideResponse>;
    } catch (e) {
        const error = e as AxiosError;
        return {
            data: error.message,
            status: error.status,
        };
    }
}

export async function changeGuideStatusAction(
    id: string,
    status: "DRAFT" | "PUBLISHED" | "PROTECTED",
): Promise<RequestSuccess<GuideResponse> | RequestFailure> {
    try {
        const response = await LEARNING_HTTP.patch<GuideResponse>(
            `/guides/${id}/status?status=${status}`,
        );

        revalidatePath("/guides");
        return {
            status: response.status,
            data: response.data,
        } as RequestSuccess<GuideResponse>;
    } catch (e) {
        const error = e as AxiosError;
        return {
            data: error.message,
            status: error.status,
        };
    }
}

// DELETE
export async function deleteGuideAction(
    id: string,
): Promise<RequestSuccess<void> | RequestFailure> {
    try {
        const response = await LEARNING_HTTP.delete(`/guides/${id}`);

        revalidatePath("/guides");
        return {
            status: response.status,
            data: undefined,
        } as RequestSuccess<void>;
    } catch (e) {
        const error = e as AxiosError;
        return {
            data: error.message,
            status: error.status,
        };
    }
}
