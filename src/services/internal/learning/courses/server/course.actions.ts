"use server";

import { API_GATEWAY_HTTP } from "@/services/axios.config";
import type { LearningResponse } from "../../shared";
import type {
    AddGuideToCourseRequest,
    CourseResponse,
    CreateCourseRequest,
    DeleteCourseRequest,
    DeleteGuideFromCourseRequest,
    GetCourseById,
    UpdateCourseAuthorsRequest,
    UpdateCourseRequest,
    UpdateCourseStatusRequest,
} from "../controller/course.response";

export async function getCoursesAction(): Promise<CourseResponse[]> {
    const response =
        await API_GATEWAY_HTTP.get<LearningResponse<CourseResponse[]>>(
            "/courses",
        );
    return response.data.data;
}

export async function createCourseAction(
    request: CreateCourseRequest,
): Promise<CourseResponse> {
    const response = await API_GATEWAY_HTTP.post<CourseResponse>(
        "/courses",
        request,
    );
    return response.data;
}

export async function getCourseByIdAction(
    request: GetCourseById,
): Promise<CourseResponse> {
    const response = await API_GATEWAY_HTTP.get<CourseResponse>(
        `/courses/${request.courseId}`,
    );
    return response.data;
}

export async function updateCourseAction(
    courseId: string,
    request: UpdateCourseRequest,
): Promise<CourseResponse> {
    const response = await API_GATEWAY_HTTP.put<CourseResponse>(
        `/courses/${courseId}`,
        request,
    );
    return response.data;
}

export async function deleteCourseAction(
    request: DeleteCourseRequest,
): Promise<void> {
    await API_GATEWAY_HTTP.delete(`/courses/${request.courseId}`);
}

export async function addGuideToCourseAction(
    request: AddGuideToCourseRequest,
): Promise<CourseResponse> {
    const response = await API_GATEWAY_HTTP.post<CourseResponse>(
        `/courses/${request.courseId}/guides/${request.guideId}`,
    );
    return response.data;
}

export async function deleteGuideFromCourseAction(
    request: DeleteGuideFromCourseRequest,
): Promise<CourseResponse> {
    const response = await API_GATEWAY_HTTP.delete<
        LearningResponse<CourseResponse>
    >(`/courses/${request.courseId}/guides/${request.guideId}`);
    return response.data.data;
}

export async function reorderCourseGuideAction(
    courseId: string,
    guideId: string,
    newPosition: number,
): Promise<CourseResponse> {
    const response = await API_GATEWAY_HTTP.put<
        LearningResponse<CourseResponse>
    >(`/courses/${courseId}/guides/${guideId}/reorder`, { newPosition });
    return response.data.data;
}

export async function updateCourseAuthorsAction(
    courseId: string,
    request: UpdateCourseAuthorsRequest,
): Promise<CourseResponse> {
    const response = await API_GATEWAY_HTTP.put<
        LearningResponse<CourseResponse>
    >(`/courses/${courseId}/authors`, request);
    return response.data.data;
}

export async function updateCourseStatusAction(
    courseId: string,
    request: UpdateCourseStatusRequest,
): Promise<CourseResponse> {
    const response = await API_GATEWAY_HTTP.patch<
        LearningResponse<CourseResponse>
    >(`/courses/${courseId}/status`, request);
    return response.data.data;
}
