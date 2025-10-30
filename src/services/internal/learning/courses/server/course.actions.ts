"use server";

import { LEARNING_HTTP } from "@/services/axios.config";
import type {
    AddGuideToCourseRequest,
    CourseGuideFullResponse,
    CourseResponse,
    CreateCourseRequest,
    ReorderCourseRequest,
    UpdateCourseRequest,
} from "../controller/course.response";

export async function getCoursesAction(): Promise<CourseResponse[]> {
    const courses = await LEARNING_HTTP.get<CourseResponse[]>("/courses");
    return courses.data;
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
    id: string,
): Promise<CourseResponse | null> {
    console.log("Fetching course with id:", id);
    const response = await LEARNING_HTTP.get<CourseResponse>(`/courses/${id}`);
    return response.data;
}

export async function updateCourseByIdAction(
    id: string,
    request: UpdateCourseRequest,
): Promise<CourseResponse | null> {
    console.log("updating course with id:", id);
    const response = await LEARNING_HTTP.put<CourseResponse>(
        `/courses/${id}`,
        request,
    );

    console.log("UPDATE RESPONSE", response);
    return response.data;
}

export async function getCourseGuidesFullByCourseIdAction(
    courseId: string,
): Promise<CourseGuideFullResponse[]> {
    const response = await LEARNING_HTTP.get<CourseGuideFullResponse[]>(
        `/courses/${courseId}/guides`,
    );

    return response.data;
}

export async function searchCoursesAction(name: string) {
    const response = await LEARNING_HTTP.post<CourseGuideFullResponse[]>(
        "/courses/search",
        { name },
    );
    return response.data;
}
export async function addGuideToCourseAction(
    courseId: string,
    request: AddGuideToCourseRequest,
): Promise<CourseResponse> {
    const response = await LEARNING_HTTP.post<CourseResponse>(
        `/courses/${courseId}/guides`,
        request,
    );
    return response.data;
}

export async function reorderCourseGuideAction(
    courseId: string,
    request: ReorderCourseRequest,
): Promise<CourseResponse> {
    const response = await LEARNING_HTTP.put<CourseResponse>(
        `/courses/${courseId}/guides/reorder`,
        request,
    );
    return response.data;
}
