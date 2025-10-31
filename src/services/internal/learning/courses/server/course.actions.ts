"use server";

import { LEARNING_HTTP } from "@/services/axios.config";
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
    const response = await LEARNING_HTTP.get<CourseResponse[]>("/courses");
    return response.data;
}

export async function createCourseAction(
    request: CreateCourseRequest,
): Promise<CourseResponse> {
    const response = await LEARNING_HTTP.post<CourseResponse>(
        "/courses",
        request,
    );
    return response.data;
}

export async function getCourseByIdAction(
    request: GetCourseById,
): Promise<CourseResponse> {
    const response = await LEARNING_HTTP.get<CourseResponse>(
        `/courses/${request.courseId}`,
    );
    return response.data;
}

export async function updateCourseAction(
    courseId: string,
    request: UpdateCourseRequest,
): Promise<CourseResponse> {
    const response = await LEARNING_HTTP.put<CourseResponse>(
        `/courses/${courseId}`,
        request,
    );
    return response.data;
}

export async function deleteCourseAction(
    request: DeleteCourseRequest,
): Promise<void> {
    await LEARNING_HTTP.delete(`/courses/${request.courseId}`);
}

export async function addGuideToCourseAction(
    request: AddGuideToCourseRequest,
): Promise<CourseResponse> {
    const response = await LEARNING_HTTP.post<CourseResponse>(
        `/courses/${request.courseId}/guides/${request.guideId}`,
    );
    return response.data;
}

export async function deleteGuideFromCourseAction(
    request: DeleteGuideFromCourseRequest,
): Promise<CourseResponse> {
    const response = await LEARNING_HTTP.delete<CourseResponse>(
        `/courses/${request.courseId}/guides/${request.guideId}`,
    );
    return response.data;
}

export async function reorderCourseGuideAction(
    courseId: string,
    guideId: string,
    newPosition: number,
): Promise<CourseResponse> {
    const response = await LEARNING_HTTP.put<CourseResponse>(
        `/courses/${courseId}/guides/${guideId}/reorder`,
        { newPosition },
    );
    return response.data;
}

export async function updateCourseAuthorsAction(
    courseId: string,
    request: UpdateCourseAuthorsRequest,
): Promise<CourseResponse> {
    const response = await LEARNING_HTTP.put<CourseResponse>(
        `/courses/${courseId}/authors`,
        request,
    );
    return response.data;
}

export async function updateCourseStatusAction(
    courseId: string,
    request: UpdateCourseStatusRequest,
): Promise<CourseResponse> {
    const response = await LEARNING_HTTP.patch<CourseResponse>(
        `/courses/${courseId}/status`,
        request,
    );
    return response.data;
}
