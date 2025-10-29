"use server";

import { LEARNING_HTTP } from "@/services/axios.config";
import type { CourseResponse } from "../controller/course.response";

export async function getCoursesAction(): Promise<CourseResponse[]> {
    const courses = await LEARNING_HTTP.get<CourseResponse[]>("/courses");
    return courses.data;
}
