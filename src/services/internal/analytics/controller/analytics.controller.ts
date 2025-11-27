import type {
    AnalyticsKPIs,
    DailyKPI,
    LanguageKPI,
    StudentKPI,
    TopFailedChallenge,
} from "../entities/analytics.entity";
import {
    getDailyKPIsAction,
    getLanguageKPIsAction,
    getStudentKPIsAction,
    getTopFailedChallengesAction,
    getTotalUsersAction,
} from "../server/analytics.actions";

export class AnalyticsError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public originalError?: unknown,
    ) {
        super(message);
        this.name = `AnalyticsError ${statusCode}:`;
    }
}

export class AnalyticsController {
    /**
     * Get total registered users
     * @returns Total number of users, 0 if fetch fails
     */
    public static async getTotalUsers(): Promise<number> {
        try {
            const response = await getTotalUsersAction();

            if (response.status === 200 && response.data) {
                return (response.data as { total_users: number }).total_users;
            }

            console.error("Failed to fetch total users:", response);
            return 0;
        } catch (error) {
            console.error("Error fetching total users:", error);
            throw new AnalyticsError("Failed to fetch total users", 500, error);
        }
    }

    /**
     * Get daily KPIs
     * @param limit - Number of days to fetch (default: 30)
     * @returns Array of daily KPIs, empty array if fetch fails
     */
    public static async getDailyKPIs(limit: number = 30): Promise<DailyKPI[]> {
        try {
            const response = await getDailyKPIsAction(limit);

            if (response.status === 200 && response.data) {
                return response.data as DailyKPI[];
            }

            console.error("Failed to fetch daily KPIs:", response);
            return [];
        } catch (error) {
            console.error("Error fetching daily KPIs:", error);
            throw new AnalyticsError(
                "Failed to fetch daily KPIs",
                500,
                error,
            );
        }
    }

    /**
     * Get KPIs by programming language
     * @returns Array of language KPIs, empty array if fetch fails
     */
    public static async getLanguageKPIs(): Promise<LanguageKPI[]> {
        try {
            const response = await getLanguageKPIsAction();

            if (response.status === 200 && response.data) {
                return response.data as LanguageKPI[];
            }

            console.error("Failed to fetch language KPIs:", response);
            return [];
        } catch (error) {
            console.error("Error fetching language KPIs:", error);
            throw new AnalyticsError(
                "Failed to fetch language KPIs",
                500,
                error,
            );
        }
    }

    /**
     * Get KPIs for a specific student
     * @param studentId - Student ID
     * @returns Student KPI data or null if fetch fails
     */
    public static async getStudentKPIs(
        studentId: string,
    ): Promise<StudentKPI | null> {
        try {
            const response = await getStudentKPIsAction(studentId);

            if (response.status === 200 && response.data) {
                return response.data as StudentKPI;
            }

            console.error("Failed to fetch student KPIs:", response);
            return null;
        } catch (error) {
            console.error("Error fetching student KPIs:", error);
            throw new AnalyticsError(
                "Failed to fetch student KPIs",
                500,
                error,
            );
        }
    }

    /**
     * Get top failed challenges
     * @param limit - Number of challenges to fetch (default: 10)
     * @returns Array of top failed challenges, empty array if fetch fails
     */
    public static async getTopFailedChallenges(
        limit: number = 10,
    ): Promise<TopFailedChallenge[]> {
        try {
            const response = await getTopFailedChallengesAction(limit);

            if (response.status === 200 && response.data) {
                return response.data as TopFailedChallenge[];
            }

            console.error("Failed to fetch top failed challenges:", response);
            return [];
        } catch (error) {
            console.error("Error fetching top failed challenges:", error);
            throw new AnalyticsError(
                "Failed to fetch top failed challenges",
                500,
                error,
            );
        }
    }

    /**
     * Get all analytics KPIs in one call
     * @param dailyLimit - Limit for daily KPIs (default: 30)
     * @param failedChallengesLimit - Limit for failed challenges (default: 10)
     * @returns Object containing all analytics KPIs
     */
    public static async getAllKPIs(
        dailyLimit: number = 30,
        failedChallengesLimit: number = 10,
    ): Promise<AnalyticsKPIs> {
        try {
            const [totalUsers, dailyKPIs, languageKPIs, topFailedChallenges] =
                await Promise.all([
                    this.getTotalUsers(),
                    this.getDailyKPIs(dailyLimit),
                    this.getLanguageKPIs(),
                    this.getTopFailedChallenges(failedChallengesLimit),
                ]);

            return {
                totalUsers,
                dailyKPIs,
                languageKPIs,
                topFailedChallenges,
            };
        } catch (error) {
            console.error("Error fetching all KPIs:", error);
            throw new AnalyticsError("Failed to fetch all KPIs", 500, error);
        }
    }
}
