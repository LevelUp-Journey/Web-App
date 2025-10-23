import { jwtDecode } from "jwt-decode";
import { AuthController } from "../../iam/controller/auth.controller";
import {
    getProfileAction,
    getProfileByIdAction,
    updateProfileAction,
    searchProfilesAction,
} from "../server/profile.actions";
import type { ProfileResponse, UpdateProfileRequest } from "./profile.response";

export class ProfileController {
    public static async getProfileByUserId(userId: string) {
        const response = await getProfileAction(userId);
        if (response.status === 200) {
            return response.data as ProfileResponse;
        }
        throw new Error("Failed to fetch profile");
    }

    public static async updateProfileByUserId(
        userId: string,
        data: UpdateProfileRequest,
    ) {
        console.log("Updating profile", data);
        const response = await updateProfileAction(userId, data);
        if (response.status === 200) {
            return response.data;
        }
        throw new Error("Failed to update profile");
    }

    public static async getCurrentUserProfile() {
        const token = await AuthController.getAuthToken();
        const jwtPayload = jwtDecode<{ userId: string }>(token);

        const response = await getProfileAction(jwtPayload.userId);
        return response.data as ProfileResponse;
    }

    public static async getProfileById(profileId: string) {
        const response = await getProfileByIdAction(profileId);
        if (response.status === 200) {
            return response.data as ProfileResponse;
        }
        throw new Error("Failed to fetch profile");
    }

    public static async searchProfiles(query: string) {
        const response = await searchProfilesAction(query);
        if (response.status === 200) {
            return response.data as ProfileResponse[];
        }
        throw new Error("Failed to search profiles");
    }
}
