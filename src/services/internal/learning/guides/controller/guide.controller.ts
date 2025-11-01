import {
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
    UpdateGuideRequest,
    UpdateGuideStatusRequest,
    UpdatePageRequest,
} from "./guide.response";

export class GuideController {
    public static async getAllGuides(): Promise<GuideResponse[]> {
        const response = await getAllGuidesAction();
        return response;
    }

    public static async getGuidesPaginated(
        request?: GetGuidesPaginatedRequest,
    ): Promise<GetGuidesResponseFormat> {
        const response = await getGuidesPaginatedAction(request);
        return response;
    }

    public static async createGuide(
        request: CreateGuideRequest,
    ): Promise<GuideResponse> {
        const response = await createGuideAction(request);
        return response;
    }

    public static async getGuideById(guideId: string): Promise<GuideResponse> {
        const response = await getGuideByIdAction(guideId);
        return response;
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
        const response = await getTeachersGuidesAction(teacherId);
        return response;
    }

    public static async getTeachersGuidesPaginated(
        teacherId: string,
        request?: GetGuidesPaginatedRequest,
    ): Promise<GetGuidesResponseFormat> {
        const response = await getTeachersGuidesPaginatedAction(
            teacherId,
            request,
        );
        return response;
    }
}
