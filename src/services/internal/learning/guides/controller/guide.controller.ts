import { createGuideAction, getGuideAction } from "../server/guide.actions";
import type { CreateGuideRequest } from "./guide.response";

export class GuideController {
    public static async getGuideById(id: string) {
        const response = await getGuideAction(id);
        return response;
    }

    public static async createGuide(guide: CreateGuideRequest) {
        const response = await createGuideAction(guide);
        return response;
    }
}
