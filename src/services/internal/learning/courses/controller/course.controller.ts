import { getCoursesAction } from "../server/course.actions";
import type { CourseResponse } from "./course.response";

export class CourseController {
    public static async getCourses(): Promise<CourseResponse[]> {
        const response = await getCoursesAction();
        return response;
    }
}
