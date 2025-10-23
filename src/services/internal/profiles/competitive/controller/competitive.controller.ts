import {
    getCompetitiveProfileAction,
    getUsersByRankAction,
} from "../server/competitive.actions";
import type { CompetitiveProfile } from "../entities/competitive-profile.entity";

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

    public static async getUsersByRank(
        rank: string,
    ): Promise<CompetitiveProfile[]> {
        const response = await getUsersByRankAction(rank);
        if (response.status === 200) {
            return response.data as CompetitiveProfile[];
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
