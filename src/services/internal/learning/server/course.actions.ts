"use server";

import type { AxiosError } from "axios";
import { revalidatePath } from "next/cache";
import {
    LEARNING_HTTP,
    type RequestFailure,
    type RequestSuccess,
} from "../../../axios.config";
import type {
    CourseListResponse,
    CourseResponse,
    CreateCourseRequest,
    GetCourseListParams,
    UpdateCourseRequest,
} from "../controller/course.response";

// CREATE
export async function createCourseAction(
    data: CreateCourseRequest,
): Promise<RequestSuccess<CourseResponse> | RequestFailure> {
    try {
        const response = await LEARNING_HTTP.post<CourseResponse>(
            "/courses",
            data,
        );

        revalidatePath("/courses");
        return {
            status: response.status,
            data: response.data,
        } as RequestSuccess<CourseResponse>;
    } catch (e) {
        const error = e as AxiosError;
        return {
            data: error.message,
            status: error.status,
        };
    }
}

// READ
export async function getCourseByIdAction(
    id: string,
): Promise<RequestSuccess<CourseResponse> | RequestFailure> {
    try {
        const response = await LEARNING_HTTP.get<CourseResponse>(
            `/courses/${id}`,
        );

        return {
            status: response.status,
            data: response.data,
        } as RequestSuccess<CourseResponse>;
    } catch (e) {
        const error = e as AxiosError;
        return {
            data: error.message,
            status: error.status,
        };
    }
}

export async function getCourseListAction(
    params?: GetCourseListParams,
): Promise<RequestSuccess<CourseListResponse> | RequestFailure> {
    try {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.status) queryParams.append("status", params.status);
        if (params?.difficulty)
            queryParams.append("difficulty", params.difficulty);
        if (params?.teacherId)
            queryParams.append("teacherId", params.teacherId);

        const response = await LEARNING_HTTP.get<CourseListResponse>(
            `/courses?${queryParams}`,
        );

        return {
            status: response.status,
            data: response.data,
        } as RequestSuccess<CourseListResponse>;
    } catch (e) {
        const error = e as AxiosError;
        return {
            data: error.message,
            status: error.status,
        };
    }
}

// UPDATE
export async function updateCourseAction(
    id: string,
    data: UpdateCourseRequest,
): Promise<RequestSuccess<CourseResponse> | RequestFailure> {
    try {
        const response = await LEARNING_HTTP.put<CourseResponse>(
            `/courses/${id}`,
            data,
        );

        revalidatePath("/courses");
        return {
            status: response.status,
            data: response.data,
        } as RequestSuccess<CourseResponse>;
    } catch (e) {
        const error = e as AxiosError;
        return {
            data: error.message,
            status: error.status,
        };
    }
}

// PUBLISH/UNPUBLISH
export async function publishCourseAction(
    id: string,
): Promise<RequestSuccess<CourseResponse> | RequestFailure> {
    try {
        const response = await LEARNING_HTTP.patch<CourseResponse>(
            `/courses/${id}/publish`,
        );

        revalidatePath("/courses");
        return {
            status: response.status,
            data: response.data,
        } as RequestSuccess<CourseResponse>;
    } catch (e) {
        const error = e as AxiosError;
        return {
            data: error.message,
            status: error.status,
        };
    }
}

export async function unpublishCourseAction(
    id: string,
): Promise<RequestSuccess<CourseResponse> | RequestFailure> {
    try {
        const response = await LEARNING_HTTP.patch<CourseResponse>(
            `/courses/${id}/unpublish`,
        );

        revalidatePath("/courses");
        return {
            status: response.status,
            data: response.data,
        } as RequestSuccess<CourseResponse>;
    } catch (e) {
        const error = e as AxiosError;
        return {
            data: error.message,
            status: error.status,
        };
    }
}

// DELETE
export async function deleteCourseAction(
    id: string,
): Promise<RequestSuccess<void> | RequestFailure> {
    try {
        const response = await LEARNING_HTTP.delete(`/courses/${id}`);

        revalidatePath("/courses");
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
