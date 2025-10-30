"use client";

import { useState, useEffect } from "react";
import { CompetitiveController } from "@/services/internal/profiles/competitive/controller/competitive.controller";
import type { UsersByRankResponse } from "@/services/internal/profiles/competitive/entities/competitive-profile.entity";

interface LeaderboardTableProps {
    selectedRank: string;
}

export function LeaderboardTable({ selectedRank }: LeaderboardTableProps) {
    const [usersData, setUsersData] = useState<UsersByRankResponse | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const data = await CompetitiveController.getUsersByRank(selectedRank);
                setUsersData(data);
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

    if (!usersData) {
        return <div className="text-center py-8">No data available</div>;
    }

    return (
        <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
                Total users: {usersData.totalUsers}
            </div>

            <div className="grid gap-4">
                {usersData.profiles.map((profile) => (
                    <div
                        key={profile.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                    >
                        <div>
                            <div className="font-medium">{profile.userId}</div>
                            <div className="text-sm text-muted-foreground">
                                Current Rank: {profile.currentRank}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-medium">{profile.totalPoints} points</div>
                            <div className="text-sm text-muted-foreground">
                                Next: {profile.nextRank} ({profile.pointsNeededForNextRank} points needed)
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}