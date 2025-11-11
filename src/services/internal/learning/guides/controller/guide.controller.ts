import {
    addChallengeToGuideAction,
    createGuideAction,
    createPageAction,
    deleteGuideAction,
    deletePageAction,
    type GetGuidesPaginatedRequest,
    type GetGuidesResponseFormat,
    getAllGuidesAction,
    getGuideByIdAction,
    getGuidePagesByGuideIdAction,
    getGuidesPaginatedAction,
    getPageByIdAction,
    getTeachersGuidesAction,
    getTeachersGuidesPaginatedAction,
    removeChallengeFromGuideAction,
    searchGuideAction,
    updateGuideAction,
    updateGuideStatusAction,
    updatePageAction,
} from "../server/guide.actions";
import type {
    CreateGuideRequest,
    CreatePageRequest,
    DeleteGuideRequest,
    DeletePageRequest,
    GetGuidePagesByGuideIdRequest,
    GetPageByIdRequest,
    GuideResponse,
    SearchGuideRequest,
    SearchGuidesResponse,
    UpdateGuideRequest,
    UpdateGuideStatusRequest,
    UpdatePageRequest,
} from "./guide.response";

export class GuideController {
    public static async getAllGuides(
        forParam?: string,
    ): Promise<GuideResponse[]> {
        try {
            const response = await getAllGuidesAction(forParam);
            return response;
        } catch (error) {
            console.error("Error in GuideController.getAllGuides:", error);
            return [];
        }
    }

    public static async getGuidesPaginated(
        request?: GetGuidesPaginatedRequest,
        forParam?: string,
    ): Promise<GetGuidesResponseFormat | null> {
        try {
            const response = await getGuidesPaginatedAction(request, forParam);
            return response;
        } catch (error) {
            console.error(
                "Error in GuideController.getGuidesPaginated:",
                error,
            );
            return null;
        }
    }

    public static async createGuide(
        request: CreateGuideRequest,
    ): Promise<GuideResponse | null> {
        try {
            const response = await createGuideAction(request);
            return response;
        } catch (error) {
            console.error("Error in GuideController.createGuide:", error);
            return null;
        }
    }

    public static async getGuideById(
        guideId: string,
    ): Promise<GuideResponse | null> {
        try {
            const response = await getGuideByIdAction(guideId);
            console.log("Response for getGuideById:", response);
            return response;
        } catch (error) {
            console.error("Error in GuideController.getGuideById:", error);
            return null;
        }
    }

    public static async updateGuide(
        guideId: string,
        request: UpdateGuideRequest,
    ): Promise<GuideResponse> {
        const response = await updateGuideAction(guideId, request);
        return response;
    }

    public static async deleteGuide(
        request: DeleteGuideRequest,
    ): Promise<void> {
        await deleteGuideAction(request);
    }

    public static async updateGuideStatus(
        guideId: string,
        request: UpdateGuideStatusRequest,
    ): Promise<GuideResponse> {
        const response = await updateGuideStatusAction(guideId, request);
        return response;
    }

    // Page-related methods
    public static async getGuidePagesByGuideId(
        request: GetGuidePagesByGuideIdRequest,
    ): Promise<GuideResponse> {
        const response = await getGuidePagesByGuideIdAction(request);
        return response;
    }

    public static async createPage(
        guideId: string,
        request: CreatePageRequest,
    ): Promise<GuideResponse> {
        console.log("Request:", request);
        console.log("Guide ID:", guideId);
        const response = await createPageAction(guideId, request);
        return response;
    }

    public static async getPageById(
        request: GetPageByIdRequest,
    ): Promise<GuideResponse> {
        const response = await getPageByIdAction(request);
        return response;
    }

    public static async updatePage(
        guideId: string,
        pageId: string,
        request: UpdatePageRequest,
    ): Promise<GuideResponse> {
        const response = await updatePageAction(guideId, pageId, request);
        return response;
    }

    public static async deletePage(
        request: DeletePageRequest,
    ): Promise<GuideResponse> {
        const response = await deletePageAction(request);
        return response;
    }

    public static async getTeachersGuides(
        teacherId: string,
    ): Promise<GuideResponse[]> {
        try {
            const response = await getTeachersGuidesAction(teacherId);
            return response;
        } catch (error) {
            console.error("Error in GuideController.getTeachersGuides:", error);
            return [];
        }
    }

    public static async getTeachersGuidesPaginated(
        teacherId: string,
        request?: GetGuidesPaginatedRequest,
    ): Promise<GetGuidesResponseFormat | null> {
        try {
            const response = await getTeachersGuidesPaginatedAction(
                teacherId,
                request,
            );
            return response;
        } catch (error) {
            console.error(
                "Error in GuideController.getTeachersGuidesPaginated:",
                error,
            );
            return null;
        }
    }

    public static async searchGuides(
        request: SearchGuideRequest,
    ): Promise<GuideResponse[]> {
        try {
            const response: SearchGuidesResponse =
                await searchGuideAction(request);
            return response.content;
        } catch (error) {
            console.error("Error in GuideController.searchGuides:", error);
            return [];
        }
    }

    public static async addChallengeToGuide(
        guideId: string,
        challengeId: string,
    ): Promise<GuideResponse> {
        const response = await addChallengeToGuideAction(guideId, challengeId);
        return response;
    }

    public static async removeChallengeFromGuide(
        guideId: string,
        challengeId: string,
    ): Promise<void> {
        await removeChallengeFromGuideAction(guideId, challengeId);
    }
}
