import type { RequestFailure, RequestSuccess } from "../../../axios.config";
import {
    createGuideAction,
    deleteGuideAction,
    getGuideByIdAction,
    getGuideListAction,
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
                return (response as RequestSuccess<GuideListResponse>).data;
            } else {
                throw new Error((response as RequestFailure).data);
            }
        } catch (error) {
            console.error("Error getting guide list:", error);
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
