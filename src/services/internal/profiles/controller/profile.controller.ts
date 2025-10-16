import {
    getProfileAction,
    updateProfileAction,
} from "../server/profile.actions";
import type { ProfileResponse } from "./profile.response";

export class ProfileController {
    public static async getProfileByUserId(userId: string) {
        const response = await getProfileAction(userId);
        if (response.status === 200) {
            return response.data as ProfileResponse;
        }
        throw new Error("Failed to fetch profile");
    }

    public static async updateProfileByUserId(userId: string, data: FormData) {
        const response = await updateProfileAction(userId, data);
        if (response.status === 200) {
            return response.data;
        }
        throw new Error("Failed to update profile");
    }
}
