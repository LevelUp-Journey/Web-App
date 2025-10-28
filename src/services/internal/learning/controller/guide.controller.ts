import type { RequestFailure, RequestSuccess } from "../../../axios.config";
import {
    changeGuideStatusAction,
    createGuideAction,
    deleteGuideAction,
    getGuideByIdAction,
    getGuideListAction,
    getGuidesByCourseAction,
    updateGuideAction,
} from "../server/guide.actions";
import type {
    CreateGuideRequest,
    GetGuideListParams,
    GuideListResponse,
    GuideResponse,
    UpdateGuideRequest,
} from "./guide.response";

export class GuideController {
    // CREATE
    static async create(data: CreateGuideRequest): Promise<GuideResponse> {
        try {
            const response = await createGuideAction(data);
            if (
                response.status &&
                response.status >= 200 &&
                response.status < 300
            ) {
                return (response as RequestSuccess<GuideResponse>).data;
            } else {
                throw new Error((response as RequestFailure).data);
            }
        } catch (error) {
            console.error("Error creating guide:", error);
            throw error;
        }
    }

    // READ
    static async getById(id: string): Promise<GuideResponse> {
        try {
            const response = await getGuideByIdAction(id);
            if (
                response.status &&
                response.status >= 200 &&
                response.status < 300
            ) {
                return (response as RequestSuccess<GuideResponse>).data;
            } else {
                throw new Error((response as RequestFailure).data);
            }
        } catch (error) {
            console.error("Error getting guide by id:", error);
            throw error;
        }
    }

    static async getList(
        params?: GetGuideListParams,
    ): Promise<GuideListResponse> {
        try {
            const response = await getGuideListAction(params);
            if (
                response.status &&
                response.status >= 200 &&
                response.status < 300
            ) {
                // Backend returns an array directly, wrap it in GuideListResponse format
                const guides = (response as RequestSuccess<GuideResponse[]>)
                    .data;
                return {
                    data: guides,
                    total: guides.length,
                    page: params?.page || 1,
                    limit: params?.limit || guides.length,
                };
            } else {
                throw new Error((response as RequestFailure).data);
            }
        } catch (error) {
            console.error("Error getting guide list:", error);
            throw error;
        }
    }

    static async getByCourse(courseId: string): Promise<GuideResponse[]> {
        try {
            const response = await getGuidesByCourseAction(courseId);
            if (
                response.status &&
                response.status >= 200 &&
                response.status < 300
            ) {
                return (response as RequestSuccess<GuideResponse[]>).data;
            } else {
                throw new Error((response as RequestFailure).data);
            }
        } catch (error) {
            console.error("Error getting guides by course:", error);
            throw error;
        }
    }

    // UPDATE
    static async update(
        id: string,
        data: UpdateGuideRequest,
    ): Promise<GuideResponse> {
        try {
            const response = await updateGuideAction(id, data);
            if (
                response.status &&
                response.status >= 200 &&
                response.status < 300
            ) {
                return (response as RequestSuccess<GuideResponse>).data;
            } else {
                throw new Error((response as RequestFailure).data);
            }
        } catch (error) {
            console.error("Error updating guide:", error);
            throw error;
        }
    }

    static async changeStatus(
        id: string,
        status: "DRAFT" | "PUBLISHED" | "PROTECTED",
    ): Promise<GuideResponse> {
        try {
            const response = await changeGuideStatusAction(id, status);
            if (
                response.status &&
                response.status >= 200 &&
                response.status < 300
            ) {
                return (response as RequestSuccess<GuideResponse>).data;
            } else {
                throw new Error((response as RequestFailure).data);
            }
        } catch (error) {
            console.error("Error changing guide status:", error);
            throw error;
        }
    }

    // DELETE
    static async delete(id: string): Promise<void> {
        try {
            const response = await deleteGuideAction(id);
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
            console.error("Error deleting guide:", error);
            throw error;
        }
    }
}
