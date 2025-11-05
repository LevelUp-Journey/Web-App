import {
    addGuideToCourseAction,
    createCourseAction,
    deleteCourseAction,
    deleteGuideFromCourseAction,
    getCourseByIdAction,
    getCoursesAction,
    reorderCourseGuideAction,
    updateCourseAction,
    updateCourseAuthorsAction,
    updateCourseStatusAction,
} from "../server/course.actions";
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
        request: GetCourseById,
    ): Promise<CourseResponse> {
        const response = await getCourseByIdAction(request);
        return response;
    }

    public static async updateCourse(
        courseId: string,
        request: UpdateCourseRequest,
    ): Promise<CourseResponse> {
        const response = await updateCourseAction(courseId, request);
        return response;
    }

    public static async deleteCourse(
        request: DeleteCourseRequest,
    ): Promise<void> {
        await deleteCourseAction(request);
    }

    public static async addGuideToCourse(
        request: AddGuideToCourseRequest,
    ): Promise<CourseResponse> {
        const response = await addGuideToCourseAction(request);
        return response;
    }

    public static async deleteGuideFromCourse(
        request: DeleteGuideFromCourseRequest,
    ): Promise<CourseResponse> {
        const response = await deleteGuideFromCourseAction(request);
        return response;
    }

    public static async reorderCourseGuide(
        courseId: string,
        guideId: string,
        newPosition: number,
    ): Promise<CourseResponse> {
        const response = await reorderCourseGuideAction(
            courseId,
            guideId,
            newPosition,
        );
        return response;
    }

    public static async updateCourseAuthors(
        courseId: string,
        request: UpdateCourseAuthorsRequest,
    ): Promise<CourseResponse> {
        const response = await updateCourseAuthorsAction(courseId, request);
        return response;
    }

    public static async updateCourseStatus(
        courseId: string,
        request: UpdateCourseStatusRequest,
    ): Promise<CourseResponse> {
        const response = await updateCourseStatusAction(courseId, request);
        return response;
    }
}
