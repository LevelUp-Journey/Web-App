import {
    createCourseAction,
    getCourseByIdAction,
    getCoursesAction,
} from "../server/course.actions";
import type { CourseResponse, CreateCourseRequest } from "./course.response";

export class CourseController {
    public static async getCourses(): Promise<CourseResponse[]> {
        const response = await getCoursesAction();
        return response;
    }

    public static async createCourse(
        request: CreateCourseRequest,
    ): Promise<CourseResponse> {
        const response = await createCourseAction(request);
        return response;
    }

    public static async getCourseById(
        id: string,
    ): Promise<CourseResponse | null> {
        const response = await getCourseByIdAction(id);
        return response;
    }
}
