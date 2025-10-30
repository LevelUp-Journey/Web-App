"use server";

import { LEARNING_HTTP } from "@/services/axios.config";
import type {
    CourseResponse,
    CreateCourseRequest,
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
    const response = await LEARNING_HTTP.get<CourseResponse>(`/courses/${id}`);
    return response.data;
}
