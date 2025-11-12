import { jwtDecode } from "jwt-decode";
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
    public static async getProfileByUserId(
        userId: string,
    ): Promise<ProfileResponse | null> {
        try {
            const response = await getProfileAction(userId);
            if (response.status === 200) {
                return response.data as ProfileResponse;
            }
            return null;
        } catch (_error) {
            return null;
        }
    }

    public static async updateProfileByUserId(
        userId: string,
        data: UpdateProfileRequest,
    ): Promise<ProfileResponse | null> {
        try {
            const response = await updateProfileAction(userId, data);
            if (response.status === 200) {
                return response.data as ProfileResponse;
            }
            return null;
        } catch (_error) {
            return null;
        }
    }

    public static async getCurrentUserProfile(): Promise<ProfileResponse | null> {
        try {
            const token = await AuthController.getAuthToken();
            const jwtPayload = jwtDecode<{ userId: string }>(token);

            const response = await getProfileAction(jwtPayload.userId);
            if (response.status === 200) {
                return response.data as ProfileResponse;
            }
            return null;
        } catch (_error) {
            return null;
        }
    }

    public static async getProfileById(
        profileId: string,
    ): Promise<ProfileResponse | null> {
        try {
            const response = await getProfileByIdAction(profileId);
            if (response.status === 200) {
                return response.data as ProfileResponse;
            }
            return null;
        } catch (_error) {
            return null;
        }
    }

    public static async getAllProfiles(): Promise<ProfileResponse[]> {
        try {
            const response = await getAllProfilesAction();
            if (response.status === 200) {
                return response.data as ProfileResponse[];
            }
            return [];
        } catch (_error) {
            return [];
        }
    }

    public static async searchProfiles(
        query: string,
    ): Promise<ProfileResponse[]> {
        try {
            const response = await searchProfilesAction(query);
            if (response.status === 200) {
                return response.data as ProfileResponse[];
            }
            return [];
        } catch (_error) {
            return [];
        }
    }

    public static async searchUsersByUsername(
        username: string,
    ): Promise<SearchUserResponse[]> {
        try {
            const response = await searchUsersByUsernameAction(username);
            return response;
        } catch (_error) {
            return [];
        }
    }
}
