"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CompetitiveController } from "@/services/internal/profiles/competitive/controller/competitive.controller";
import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";
import type { UsersByRankResponse } from "@/services/internal/profiles/competitive/entities/competitive-profile.entity";
import type { ProfileResponse } from "@/services/internal/profiles/profiles/controller/profile.response";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface LeaderboardTableProps {
    selectedRank: string;
}

interface UserWithProfile {
    id: string;
    userId: string;
    totalPoints: number;
    currentRank: string;
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
    GRANDMASTER: "/ranks-trophies/trophy-grandmaster.svg",
};

export function LeaderboardTable({ selectedRank }: LeaderboardTableProps) {
    const [usersData, setUsersData] = useState<UsersByRankResponse | null>(null);
    const [usersWithProfiles, setUsersWithProfiles] = useState<UserWithProfile[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const data = await CompetitiveController.getUsersByRank(selectedRank);
                setUsersData(data);

                // Fetch profiles for each user
                const profilePromises = data.profiles.map(async (profile) => {
                    try {
                        const userProfile = await ProfileController.getProfileByUserId(profile.userId);
                        return {
                            ...profile,
                            profile: userProfile,
                        };
                    } catch (error) {
                        console.error(`Failed to fetch profile for user ${profile.userId}:`, error);
                        return {
                            ...profile,
                            profile: undefined,
                        };
                    }
                });

                const usersWithProfilesData = await Promise.all(profilePromises);
                setUsersWithProfiles(usersWithProfilesData);
            } catch (error) {
                console.error("Failed to fetch users by rank:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [selectedRank]);

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    if (!usersData || usersWithProfiles.length === 0) {
        return <div className="text-center py-8">No users found for this rank</div>;
    }

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Position</TableHead>
                            <TableHead className="w-[100px]">Rank</TableHead>
                            <TableHead>Username</TableHead>
                            <TableHead className="text-right">Points</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {usersWithProfiles.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-bold text-lg">
                                    #{user.leaderboardPosition || "-"}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src={RANK_ICONS[user.currentRank]}
                                            alt={user.currentRank}
                                            width={32}
                                            height={32}
                                            className="w-8 h-8 object-contain"
                                            unoptimized
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                    {user.profile?.username || user.userId.substring(0, 20)}
                                </TableCell>
                                <TableCell className="text-right font-semibold">
                                    {user.totalPoints.toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
