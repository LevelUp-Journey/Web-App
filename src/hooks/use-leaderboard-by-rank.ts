import { useEffect, useState } from "react";
import { CompetitiveController } from "@/services/internal/profiles/competitive/controller/competitive.controller";
import { LeaderboardController } from "@/services/internal/profiles/leaderboard/controller/leaderboard.controller";
import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";

export interface LeaderboardUserEntry {
    id: string;
    userId: string;
    totalPoints: number;
    position: number;
    isTop500: boolean;
    currentRank: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
}

export function useLeaderboardByRank(rank: string | null) {
    const [leaderboard, setLeaderboard] = useState<LeaderboardUserEntry[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLeaderboardWithUsers = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch leaderboard data based on rank filter
                let leaderboardEntries;
                let total = 0;

                if (rank && rank !== "TOP") {
                    // Fetch users by specific rank from Competitive profiles
                    const rankResponse = await CompetitiveController.getUsersByRank(rank);
                    leaderboardEntries = rankResponse.profiles.map((profile: any) => ({
                        id: profile.id,
                        userId: profile.userId,
                        totalPoints: profile.totalPoints,
                        position: 0, // Position not provided by competitive endpoint
                        isTop500: false,
                        currentRank: profile.currentRank || "BRONZE",
                    }));
                    total = rankResponse.totalUsers;
                } else {
                    // Fetch top 500 (all ranks) - used for null rank or "TOP" rank
                    const response = await LeaderboardController.getTop500();
                    // TOP500 API returns array directly
                    leaderboardEntries = Array.isArray(response) ? response : [];
                    total = 500; // API doesn't provide totalUsers for TOP500
                }

                setTotalUsers(total);

                // Fetch user profiles for each leaderboard entry
                const entriesWithUsers = await Promise.all(
                    leaderboardEntries.map(async (entry: any) => {
                        try {
                            const profile =
                                await ProfileController.getProfileByUserId(
                                    entry.userId,
                                );
                            return {
                                ...entry,
                                username: profile.username,
                                firstName: profile.firstName,
                                lastName: profile.lastName,
                                profileImageUrl: profile.profileUrl,
                                currentRank: entry.currentRank || "BRONZE",
                            };
                        } catch (err) {
                            console.error(
                                `Failed to fetch profile for user ${entry.userId}:`,
                                err,
                            );
                            // If profile fetch fails, return entry with userId as username
                            return {
                                ...entry,
                                username: entry.userId.substring(0, 20),
                                currentRank: entry.currentRank || "BRONZE",
                            };
                        }
                    }),
                );

                setLeaderboard(entriesWithUsers);
            } catch (err) {
                console.error("Failed to fetch leaderboard:", err);
                const errorMsg =
                    err instanceof Error
                        ? err.message
                        : "Unknown error occurred";
                setError(errorMsg);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboardWithUsers();
    }, [rank]);

    return { leaderboard, totalUsers, loading, error };
}
