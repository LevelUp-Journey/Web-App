import {
    createCourseAction,
    getCourseByIdAction,
    getCourseGuidesFullByCourseIdAction,
    getCoursesAction,
    updateCourseByIdAction,
} from "../server/course.actions";
import type {
    CourseGuideFullResponse,
    CourseResponse,
    CreateCourseRequest,
    UpdateCourseRequest,
} from "./course.response";

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

    public static async updateCourse(
        id: string,
        request: UpdateCourseRequest,
    ): Promise<CourseResponse> {
        const response = (await updateCourseByIdAction(
            id,
            request,
        )) as CourseResponse;
        return response;
    }

    public static async getCourseGuidesFullByCourseId(
        courseId: string,
    ): Promise<CourseGuideFullResponse[]> {
        const response = await getCourseGuidesFullByCourseIdAction(courseId);
        return response;
    }
}
