import { jwtDecode } from "jwt-decode";
import { API_GATEWAY_HTTP } from "@/services/axios.config";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import {
    getAllProfilesAction,
    getProfileAction,
    getProfileByIdAction,
    searchProfilesAction,
    searchUsersByUsernameAction,
    updateProfileAction,
} from "../server/profile.actions";
import type {
    ProfileResponse,
    SearchUserResponse,
    UpdateProfileRequest,
} from "./profile.response";

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

    public static async getAllProfiles(): Promise<ProfileResponse[]> {
        const response = await getAllProfilesAction();
        if (response.status === 200) {
            return response.data as ProfileResponse[];
        }
        throw new Error("Failed to fetch all profiles");
    }

    public static async searchProfiles(query: string) {
        const response = await searchProfilesAction(query);
        if (response.status === 200) {
            return response.data as ProfileResponse[];
        }
        throw new Error("Failed to search profiles");
    }

    public static async searchUsersByUsername(
        username: string,
    ): Promise<SearchUserResponse[]> {
        const response = await searchUsersByUsernameAction(username);
        return response;
    }
}
