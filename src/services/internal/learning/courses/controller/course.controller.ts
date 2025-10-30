import {
    addGuideToCourseAction,
    createCourseAction,
    getCourseByIdAction,
    getCourseGuidesFullByCourseIdAction,
    getCoursesAction,
    reorderCourseGuideAction,
    searchCoursesAction,
    updateCourseByIdAction,
} from "../server/course.actions";
import type {
    AddGuideToCourseRequest,
    CourseGuideFullResponse,
    CourseResponse,
    CreateCourseRequest,
    ReorderCourseRequest,
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

    public static async searchCourses(
        name: string,
    ): Promise<CourseGuideFullResponse[]> {
        const response = await searchCoursesAction(name);
        return response;
    }

    public static async addGuideToCourse(
        courseId: string,
        request: AddGuideToCourseRequest,
    ): Promise<CourseResponse> {
        const response = await addGuideToCourseAction(courseId, request);
        return response;
    }

    public static async reorderCourseGuide(
        courseId: string,
        request: ReorderCourseRequest,
    ) {
        const response = await reorderCourseGuideAction(courseId, request);
        return response;
    }
}
