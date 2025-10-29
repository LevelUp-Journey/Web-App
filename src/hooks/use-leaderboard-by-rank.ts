import { useEffect, useState } from "react";
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
                    // Fetch users by specific rank
                    leaderboardEntries = await LeaderboardController.getUsersByRank(rank);
                    total = leaderboardEntries.length;
                } else {
                    // Fetch top 500 (all ranks) - used for null rank or "TOP" rank
                    const response = await LeaderboardController.getTop500();
                    leaderboardEntries = response.entries;
                    total = response.totalUsers;
                }

                setTotalUsers(total);

                // Fetch user profiles for each leaderboard entry
                const entriesWithUsers = await Promise.all(
                    leaderboardEntries.map(async (entry) => {
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
