"use server";

import { LEARNING_HTTP } from "@/services/axios.config";
import type {
    CourseGuideFullResponse,
    CourseResponse,
    CreateCourseRequest,
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
