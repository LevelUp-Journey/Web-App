"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CompetitiveController } from "@/services/internal/profiles/competitive/controller/competitive.controller";
import { LeaderboardController } from "@/services/internal/profiles/leaderboard/controller/leaderboard.controller";
import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";
import type { UsersByRankResponse } from "@/services/internal/profiles/competitive/entities/competitive-profile.entity";
import type { LeaderboardResponse, LeaderboardEntry } from "@/services/internal/profiles/leaderboard/entities/leaderboard.entity";
import type { ProfileResponse } from "@/services/internal/profiles/profiles/controller/profile.response";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

interface LeaderboardTableProps {
    selectedRank: string;
}

interface UserWithProfile {
    id: string;
    userId: string;
    totalPoints: number;
    currentRank?: string; // Optional for leaderboard entries
    leaderboardPosition?: number;
    profile?: ProfileResponse;
}

const RANK_ICONS: Record<string, string> = {
    BRONZE: "/ranks/rank-bronze.svg",
    SILVER: "/ranks/rank-silver.svg",
    GOLD: "/ranks/rank-gold.svg",
    PLATINUM: "/ranks/rank-platinum.svg",
    DIAMOND: "/ranks/rank-diamond.svg",
    MASTER: "/ranks/rank-master.svg",
    GRANDMASTER: "/ranks/rank-grandmaster.svg",
};

const ITEMS_PER_PAGE = 20;

const getColumns = (selectedRank: string): ColumnDef<UserWithProfile>[] => [
    {
        accessorKey: "position",
        header: "Position",
        cell: ({ row }) => {
            const position = selectedRank === "TOP500" ? (row.original as any).position : row.original.leaderboardPosition || "-";
            return <div className="font-bold text-lg">#{position}</div>;
        },
    },
    {
        accessorKey: "currentRank",
        header: "Rank",
        cell: ({ row }) => {
            const rank = row.original.currentRank || "BRONZE";
            return (
                <div className="flex items-center gap-2">
                    <Image
                        src={RANK_ICONS[rank]}
                        alt={rank}
                        width={32}
                        height={32}
                        className="w-8 h-8 object-contain"
                        unoptimized
                    />
                </div>
            );
        },
    },
    {
        accessorKey: "username",
        header: "Username",
        cell: ({ row }) => {
            const username = row.original.profile?.username || row.original.userId.substring(0, 20);
            return <div className="font-medium">{username}</div>;
        },
    },
    {
        accessorKey: "totalPoints",
        header: "Points",
        cell: ({ row }) => {
            return <div className="text-right font-semibold">{row.original.totalPoints.toLocaleString()}</div>;
        },
    },
];

export function LeaderboardTable({ selectedRank }: LeaderboardTableProps) {
    const [usersData, setUsersData] = useState<UsersByRankResponse | LeaderboardEntry[] | null>(null);
    const [usersWithProfiles, setUsersWithProfiles] = useState<UserWithProfile[]>([]);
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
                
                let data: UsersByRankResponse | LeaderboardEntry[];
                if (selectedRank === "TOP500") {
                    data = await LeaderboardController.getTop500(offset);
                } else {
                    data = await CompetitiveController.getUsersByRank(selectedRank, offset);
                }
                setUsersData(data);

                // Handle different response structures
                let userEntries: any[];
                let totalUsers: number;
                
                if (selectedRank === "TOP500") {
                    // TOP500 API returns array directly
                    userEntries = Array.isArray(data) ? data : [];
                    // For TOP500, we assume 500 total users, but API might not provide this
                    totalUsers = 500; // This should be provided by API ideally
                } else {
                    // Other ranks return object with profiles and totalUsers
                    const responseData = data as UsersByRankResponse;
                    userEntries = responseData.profiles || [];
                    totalUsers = responseData.totalUsers || 0;
                }

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
                            const competitiveProfile = await CompetitiveController.getCompetitiveProfile(entry.userId);
                            return {
                                ...entry,
                                currentRank: competitiveProfile.currentRank,
                            };
                        } catch (error) {
                            console.error(`Failed to fetch competitive profile for user ${entry.userId}:`, error);
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
                        const userProfile = await ProfileController.getProfileByUserId(entry.userId);
                        return {
                            ...entry,
                            profile: userProfile,
                        };
                    } catch (error) {
                        console.error(`Failed to fetch profile for user ${entry.userId}:`, error);
                        return {
                            ...entry,
                            profile: undefined,
                        };
                    }
                });

                const usersWithProfilesData = await Promise.all(profilePromises);
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

    const totalUsers = selectedRank === "TOP500" ? 500 : (usersData as UsersByRankResponse)?.totalUsers || 0;
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

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    if (!usersData || usersWithProfiles.length === 0) {
        return <div className="text-center py-8">No users found for this rank</div>;
    }

    return (
        <div className="space-y-4">
            <DataTable
                columns={getColumns(selectedRank)}
                data={usersWithProfiles}
                loading={loading}
                emptyMessage="No users found for this rank"
            />

            {/* Pagination Controls removed */}
        </div>
    );
}
