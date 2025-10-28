import type { RequestFailure, RequestSuccess } from "../../../axios.config";
import {
    createCourseAction,
    deleteCourseAction,
    getCourseByIdAction,
    getCourseListAction,
    getCoursesByDifficultyAction,
    getCoursesByStatusAction,
    getCoursesByTeacherAction,
    publishCourseAction,
    unpublishCourseAction,
    updateCourseAction,
} from "../server/course.actions";
import type {
    CourseListResponse,
    CourseResponse,
    CreateCourseRequest,
    GetCourseListParams,
    UpdateCourseRequest,
} from "./course.response";

export class CourseController {
    // CREATE
    static async create(data: CreateCourseRequest): Promise<CourseResponse> {
        try {
            const response = await createCourseAction(data);
            if (
                response.status &&
                response.status >= 200 &&
                response.status < 300
            ) {
                return (response as RequestSuccess<CourseResponse>).data;
            } else {
                throw new Error((response as RequestFailure).data);
            }
        } catch (error) {
            console.error("Error creating course:", error);
            throw error;
        }
    }

    // READ
    static async getById(id: string): Promise<CourseResponse> {
        try {
            const response = await getCourseByIdAction(id);
            if (
                response.status &&
                response.status >= 200 &&
                response.status < 300
            ) {
                return (response as RequestSuccess<CourseResponse>).data;
            } else {
                throw new Error((response as RequestFailure).data);
            }
        } catch (error) {
            console.error("Error getting course by id:", error);
            throw error;
        }
    }

    static async getList(
        params?: GetCourseListParams,
    ): Promise<CourseListResponse> {
        try {
            const response = await getCourseListAction(params);
            if (
                response.status &&
                response.status >= 200 &&
                response.status < 300
            ) {
                return (response as RequestSuccess<CourseListResponse>).data;
            } else {
                throw new Error((response as RequestFailure).data);
            }
        } catch (error) {
            console.error("Error getting course list:", error);
            throw error;
        }
    }

    static async getByStatus(
        status: "DRAFT" | "PUBLISHED" | "ARCHIVED",
    ): Promise<CourseListResponse> {
        try {
            const response = await getCoursesByStatusAction(status);
            if (
                response.status &&
                response.status >= 200 &&
                response.status < 300
            ) {
                return (response as RequestSuccess<CourseListResponse>).data;
            } else {
                throw new Error((response as RequestFailure).data);
            }
        } catch (error) {
            console.error("Error getting courses by status:", error);
            throw error;
        }
    }

    static async getByTeacher(teacherId: string): Promise<CourseListResponse> {
        try {
            const response = await getCoursesByTeacherAction(teacherId);
            if (
                response.status &&
                response.status >= 200 &&
                response.status < 300
            ) {
                return (response as RequestSuccess<CourseListResponse>).data;
            } else {
                throw new Error((response as RequestFailure).data);
            }
        } catch (error) {
            console.error("Error getting courses by teacher:", error);
            throw error;
        }
    }

    static async getByDifficulty(
        difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
    ): Promise<CourseListResponse> {
        try {
            const response = await getCoursesByDifficultyAction(difficulty);
            if (
                response.status &&
                response.status >= 200 &&
                response.status < 300
            ) {
                return (response as RequestSuccess<CourseListResponse>).data;
            } else {
                throw new Error((response as RequestFailure).data);
            }
        } catch (error) {
            console.error("Error getting courses by difficulty:", error);
            throw error;
        }
    }

    // UPDATE
    static async update(
        id: string,
        data: UpdateCourseRequest,
    ): Promise<CourseResponse> {
        try {
            const response = await updateCourseAction(id, data);
            if (
                response.status &&
                response.status >= 200 &&
                response.status < 300
            ) {
                return (response as RequestSuccess<CourseResponse>).data;
            } else {
                throw new Error((response as RequestFailure).data);
            }
        } catch (error) {
            console.error("Error updating course:", error);
            throw error;
        }
    }

    // PUBLISH/UNPUBLISH
    static async publish(id: string): Promise<CourseResponse> {
        try {
            const response = await publishCourseAction(id);
            if (
                response.status &&
                response.status >= 200 &&
                response.status < 300
            ) {
                return (response as RequestSuccess<CourseResponse>).data;
            } else {
                throw new Error((response as RequestFailure).data);
            }
        } catch (error) {
            console.error("Error publishing course:", error);
            throw error;
        }
    }

    static async unpublish(id: string): Promise<CourseResponse> {
        try {
            const response = await unpublishCourseAction(id);
            if (
                response.status &&
                response.status >= 200 &&
                response.status < 300
            ) {
                return (response as RequestSuccess<CourseResponse>).data;
            } else {
                throw new Error((response as RequestFailure).data);
            }
        } catch (error) {
            console.error("Error unpublishing course:", error);
            throw error;
        }
    }

    // DELETE
    static async delete(id: string): Promise<void> {
        try {
            const response = await deleteCourseAction(id);
            if (
                response.status &&
                response.status >= 200 &&
                response.status < 300
            ) {
                return;
            } else {
                throw new Error((response as RequestFailure).data);
            }
        } catch (error) {
            console.error("Error deleting course:", error);
            throw error;
        }
    }
}
