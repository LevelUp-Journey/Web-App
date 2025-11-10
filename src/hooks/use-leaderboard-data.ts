"use client";

import { useEffect, useState } from "react";
import { CompetitiveController } from "@/services/internal/profiles/competitive/controller/competitive.controller";
import type {
    CompetitiveProfile,
    UsersByRankResponse,
} from "@/services/internal/profiles/competitive/entities/competitive-profile.entity";
import { LeaderboardController } from "@/services/internal/profiles/leaderboard/controller/leaderboard.controller";
import type {
    LeaderboardEntry,
    LeaderboardResponse,
} from "@/services/internal/profiles/leaderboard/entities/leaderboard.entity";

export interface UserWithProfile {
    id: string;
    userId: string;
    totalPoints: number;
    currentRank?: string; // Optional for leaderboard entries
    leaderboardPosition?: number;
    username: string;
    avatarUrl?: string;
    position?: number;
}

const ITEMS_PER_PAGE = 20;

interface ProfileExtras {
    username?: string;
    profile?: {
        username?: string;
        profileUrl?: string;
        currentRank?: string;
    };
    user?: { username?: string };
    profileImageUrl?: string;
    avatarUrl?: string;
    rank?: string;
    leaderboardPosition?: number;
    position?: number;
}

type LeaderboardSourceEntry =
    | (LeaderboardEntry & Partial<ProfileExtras>)
    | (CompetitiveProfile & Partial<ProfileExtras>);

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
        if (selectedRank) {
            setCurrentPage(0);
        }
    }, [selectedRank]);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const offset = currentPage * ITEMS_PER_PAGE;

                let data: UsersByRankResponse | LeaderboardResponse;
                let userEntries: LeaderboardSourceEntry[];

                if (selectedRank === "TOP500") {
                    const leaderboardResponse =
                        await LeaderboardController.getTop500(offset);
                    data = leaderboardResponse;
                    userEntries = leaderboardResponse.entries || [];
                } else {
                    const rankResponse =
                        await CompetitiveController.getUsersByRank(
                            selectedRank,
                            offset,
                        );
                    data = rankResponse;
                    userEntries = rankResponse.profiles || [];
                }
                setUsersData(data);

                if (!Array.isArray(userEntries)) {
                    console.error("userEntries is not an array:", userEntries);
                    setUsersWithProfiles([]);
                    return;
                }

                const enrichedEntries = userEntries.map((entry) => {
                    const leaderboardPosition =
                        typeof entry.leaderboardPosition === "number"
                            ? entry.leaderboardPosition
                            : typeof entry.position === "number"
                              ? entry.position
                              : undefined;

                    const username =
                        entry.username ||
                        entry.profile?.username ||
                        entry.user?.username ||
                        entry.userId;

                    const displayPosition =
                        typeof entry.position === "number"
                            ? entry.position
                            : leaderboardPosition;

                    return {
                        id: entry.id,
                        userId: entry.userId,
                        totalPoints: entry.totalPoints,
                        currentRank:
                            entry.currentRank ||
                            entry.rank ||
                            entry.profile?.currentRank ||
                            "BRONZE",
                        leaderboardPosition,
                        username,
                        avatarUrl:
                            entry.profile?.profileUrl ||
                            entry.profileImageUrl ||
                            entry.avatarUrl ||
                            undefined,
                        position: displayPosition,
                    };
                });

                setUsersWithProfiles(enrichedEntries);
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
