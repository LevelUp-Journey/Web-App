import type { LeaderboardEntry, LeaderboardResponse } from "../entities/leaderboard.entity";
import {
    getLeaderboardAction,
    getTop500Action,
    getUserPositionAction,
    recalculateLeaderboardAction,
} from "../server/leaderboard.actions";

export class LeaderboardController {
    public static async getLeaderboard(
        limit: number = 50,
        offset: number = 0,
    ): Promise<LeaderboardResponse> {
        const response = await getLeaderboardAction(limit, offset);
        if (response.status === 200) {
            return response.data as unknown as LeaderboardResponse;
        }

        if (response.status === 403) {
            throw new Error("403: Authentication required");
        }

        const errorMessage =
            typeof response.data === "string"
                ? response.data
                : JSON.stringify(response.data);
        throw new Error(`Failed to fetch leaderboard: ${errorMessage}`);
    }

    public static async getUserPosition(
        userId: string,
    ): Promise<LeaderboardEntry> {
        const response = await getUserPositionAction(userId);
        if (response.status === 200) {
            return response.data as LeaderboardEntry;
        }

        if (response.status === 403) {
            throw new Error("403: Authentication required");
        }

        const errorMessage =
            typeof response.data === "string"
                ? response.data
                : JSON.stringify(response.data);
        throw new Error(`Failed to fetch user position: ${errorMessage}`);
    }

    public static async getTop500(): Promise<LeaderboardEntry[]> {
        const response = await getTop500Action();
        if (response.status === 200) {
            return response.data as LeaderboardEntry[];
        }

        if (response.status === 403) {
            throw new Error("403: Authentication required");
        }

        const errorMessage =
            typeof response.data === "string"
                ? response.data
                : JSON.stringify(response.data);
        throw new Error(`Failed to fetch top 500: ${errorMessage}`);
    }

    public static async recalculateLeaderboard(): Promise<void> {
        const response = await recalculateLeaderboardAction();
        if (response.status !== 200) {
            if (response.status === 403) {
                throw new Error("403: Authentication required");
            }

            const errorMessage =
                typeof response.data === "string"
                    ? response.data
                    : JSON.stringify(response.data);
            throw new Error(
                `Failed to recalculate leaderboard: ${errorMessage}`,
            );
        }
    }
}
