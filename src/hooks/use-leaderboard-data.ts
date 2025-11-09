"use client";

import { useEffect, useState } from "react";
import { CompetitiveController } from "@/services/internal/profiles/competitive/controller/competitive.controller";
import type { UsersByRankResponse } from "@/services/internal/profiles/competitive/entities/competitive-profile.entity";
import { LeaderboardController } from "@/services/internal/profiles/leaderboard/controller/leaderboard.controller";
import type { LeaderboardResponse } from "@/services/internal/profiles/leaderboard/entities/leaderboard.entity";
import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";
import type { ProfileResponse } from "@/services/internal/profiles/profiles/controller/profile.response";

export interface UserWithProfile {
    id: string;
    userId: string;
    totalPoints: number;
    currentRank?: string; // Optional for leaderboard entries
    leaderboardPosition?: number;
    profile?: ProfileResponse;
}

const ITEMS_PER_PAGE = 20;

export function useLeaderboardData(selectedRank: string) {
    const [usersData, setUsersData] = useState<
        UsersByRankResponse | LeaderboardResponse | null
    >(null);
    const [usersWithProfiles, setUsersWithProfiles] = useState<
        UserWithProfile[]
    >([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        // Reset to first page when rank changes
        setCurrentPage(0);
    }, [selectedRank]);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const offset = currentPage * ITEMS_PER_PAGE;

                let data: UsersByRankResponse | LeaderboardResponse;
                let userEntries: any[];
                let totalCount: number;

                if (selectedRank === "TOP500") {
                    const leaderboardResponse =
                        await LeaderboardController.getTop500(offset);
                    data = leaderboardResponse;
                    userEntries = leaderboardResponse.entries || [];
                    totalCount = leaderboardResponse.totalUsers || 0;
                } else {
                    const rankResponse =
                        await CompetitiveController.getUsersByRank(
                            selectedRank,
                            offset,
                        );
                    data = rankResponse;
                    userEntries = rankResponse.profiles || [];
                    totalCount = rankResponse.totalUsers || 0;
                }
                setUsersData(data);

                // Validate that userEntries is an array
                if (!Array.isArray(userEntries)) {
                    console.error("userEntries is not an array:", userEntries);
                    setUsersWithProfiles([]);
                    return;
                }

                // For TOP500, fetch competitive profiles to get currentRank
                let entriesWithRank = [...userEntries];
                if (selectedRank === "TOP500") {
                    const rankPromises = userEntries.map(async (entry) => {
                        try {
                            const competitiveProfile =
                                await CompetitiveController.getCompetitiveProfile(
                                    entry.userId,
                                );
                            return {
                                ...entry,
                                currentRank: competitiveProfile.currentRank,
                            };
                        } catch (error) {
                            console.error(
                                `Failed to fetch competitive profile for user ${entry.userId}:`,
                                error,
                            );
                            return {
                                ...entry,
                                currentRank: "BRONZE", // Default fallback
                            };
                        }
                    });
                    entriesWithRank = await Promise.all(rankPromises);
                }

                // Fetch user profiles for each entry
                const profilePromises = entriesWithRank.map(async (entry) => {
                    try {
                        const userProfile =
                            await ProfileController.getProfileByUserId(
                                entry.userId,
                            );
                        return {
                            ...entry,
                            profile: userProfile,
                        };
                    } catch (error) {
                        console.error(
                            `Failed to fetch profile for user ${entry.userId}:`,
                            error,
                        );
                        return {
                            ...entry,
                            profile: undefined,
                        };
                    }
                });

                const usersWithProfilesData =
                    await Promise.all(profilePromises);
                setUsersWithProfiles(usersWithProfilesData);
            } catch (error) {
                console.error("Failed to fetch users:", error);
                setUsersData(null);
                setUsersWithProfiles([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [selectedRank, currentPage]);

    const totalUsers = usersData
        ? "entries" in usersData
            ? usersData.totalUsers
            : usersData.totalUsers
        : 0;
    const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);
    const hasNextPage = (currentPage + 1) * ITEMS_PER_PAGE < totalUsers;
    const hasPrevPage = currentPage > 0;

    const handlePrevPage = () => {
        if (hasPrevPage) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (hasNextPage) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleFirstPage = () => {
        setCurrentPage(0);
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages - 1);
    };

    return {
        usersWithProfiles,
        loading,
        currentPage,
        totalPages,
        hasNextPage,
        hasPrevPage,
        handlePrevPage,
        handleNextPage,
        handleFirstPage,
        handleLastPage,
        totalUsers,
    };
}
