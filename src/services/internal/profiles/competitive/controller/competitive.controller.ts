import type {
    CompetitiveProfile,
    UsersByRankResponse,
} from "../entities/competitive-profile.entity";
import {
    getCompetitiveProfileAction,
    getUsersByRankAction,
    syncCompetitiveProfileAction,
} from "../server/competitive.actions";

export class CompetitiveController {
    public static async getCompetitiveProfile(
        userId: string,
    ): Promise<CompetitiveProfile> {
        const response = await getCompetitiveProfileAction(userId);
        if (response.status === 200) {
            return response.data as CompetitiveProfile;
        }

        if (response.status === 403) {
            throw new Error("403: Authentication required");
        }

        const errorMessage =
            typeof response.data === "string"
                ? response.data
                : JSON.stringify(response.data);
        throw new Error(`Failed to fetch competitive profile: ${errorMessage}`);
    }

    public static async syncProfile(
        userId: string,
    ): Promise<CompetitiveProfile> {
        const response = await syncCompetitiveProfileAction(userId);
        if (response.status === 200) {
            return response.data as CompetitiveProfile;
        }

        if (response.status === 403) {
            throw new Error("403: Authentication required");
        }

        const errorMessage =
            typeof response.data === "string"
                ? response.data
                : JSON.stringify(response.data);
        throw new Error(`Failed to sync competitive profile: ${errorMessage}`);
    }

    public static async getUsersByRank(
        rank: string,
        offset: number = 0,
    ): Promise<UsersByRankResponse> {
        const response = await getUsersByRankAction(rank, offset);
        if (response.status === 200) {
            return response.data as UsersByRankResponse;
        }

        if (response.status === 403) {
            throw new Error("403: Authentication required");
        }

        const errorMessage =
            typeof response.data === "string"
                ? response.data
                : JSON.stringify(response.data);
        throw new Error(`Failed to fetch users by rank: ${errorMessage}`);
    }
}
