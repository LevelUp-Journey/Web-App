import type { Score } from "../entities/score.entity";
import {
    getAllScoresAction,
    getScoresByUserIdAction,
    getTotalPointsByUserIdAction,
} from "../server/scores.actions";

export class ScoresController {
    public static async getAllScores(): Promise<Score[]> {
        const response = await getAllScoresAction();
        if (response.status === 200) {
            return response.data as Score[];
        }

        if (response.status === 403) {
            throw new Error("403: Authentication required");
        }

        const errorMessage =
            typeof response.data === "string"
                ? response.data
                : JSON.stringify(response.data);
        throw new Error(`Failed to fetch all scores: ${errorMessage}`);
    }

    public static async getUserScores(userId: string): Promise<Score[]> {
        const response = await getScoresByUserIdAction(userId);
        if (response.status === 200) {
            return response.data as Score[];
        }

        if (response.status === 403) {
            throw new Error("403: Authentication required");
        }

        const errorMessage =
            typeof response.data === "string"
                ? response.data
                : JSON.stringify(response.data);
        throw new Error(`Failed to fetch user scores: ${errorMessage}`);
    }

    public static async getUserTotalPoints(userId: string): Promise<number> {
        const response = await getTotalPointsByUserIdAction(userId);
        if (response.status === 200) {
            return response.data as number;
        }

        if (response.status === 403) {
            throw new Error("403: Authentication required");
        }

        const errorMessage =
            typeof response.data === "string"
                ? response.data
                : JSON.stringify(response.data);
        throw new Error(`Failed to fetch user total points: ${errorMessage}`);
    }
}
