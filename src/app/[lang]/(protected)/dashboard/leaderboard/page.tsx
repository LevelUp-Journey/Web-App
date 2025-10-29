"use client";

import {
    AlertCircle,
    RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { MyCurrentRank } from "@/components/leaderboard/my-current-rank";
import { LeaderboardList } from "@/components/leaderboard/leaderboard-list";
import { LeaderboardPagination } from "@/components/leaderboard/leaderboard-pagination";
import { RankSelector } from "@/components/leaderboard/rank-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLeaderboardByRank } from "@/hooks/use-leaderboard-by-rank";
import { getUserIdFromTokenAction } from "@/services/internal/iam/server/auth.actions";
import { LeaderboardController } from "@/services/internal/profiles/leaderboard/controller/leaderboard.controller";

export default function LeaderboardPage() {
    const [page, setPage] = useState(1);
    const [selectedRank, setSelectedRank] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [userPosition, setUserPosition] = useState<{
        position: number;
        totalPoints: number;
        currentRank: string;
    } | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    const { leaderboard, totalUsers, loading, error } = useLeaderboardByRank(selectedRank);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = await getUserIdFromTokenAction();
                setCurrentUserId(userId);
                const position =
                    await LeaderboardController.getUserPosition(userId);
                setUserPosition(position);
            } catch (err) {
                console.error("Failed to fetch user data:", err);
            }
        };
        fetchUserData();
    }, []);

    if (loading)
        return (
            <div className="w-full h-full p-6 overflow-hidden">
                <div className="flex gap-6 h-full">
                    <div className="flex-1">
                        <Card className="h-full">
                            <CardContent className="p-6">
                                <Skeleton className="h-32 w-full mb-6" />
                                <div className="space-y-4">
                                    {Array.from({ length: 15 }, (_, i) => (
                                        <Skeleton
                                            key={i}
                                            className="h-12 w-full"
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="w-96">
                        <Skeleton className="h-96 w-full" />
                    </div>
                </div>
            </div>
        );

    if (error) {
        const isAuth = error.includes("403");
        return (
            <div className="container mx-auto p-6 max-w-4xl">
                <div className="text-center space-y-6">
                    <Card className="max-w-md mx-auto border-destructive/50">
                        <CardContent className="p-6 text-center">
                            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">
                                {isAuth
                                    ? "Authentication Required"
                                    : "Connection Error"}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                {error}
                            </p>
                            <Button
                                onClick={
                                    isAuth
                                        ? () => {
                                              window.location.href = "/auth";
                                          }
                                        : () => {
                                              setRetryCount((c) => c + 1);
                                              window.location.reload();
                                          }
                                }
                                disabled={!isAuth && retryCount >= 3}
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                {isAuth
                                    ? "Sign In"
                                    : retryCount >= 3
                                      ? "Max retries"
                                      : "Retry"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // Paginación en el frontend para filtros por rango
    const itemsPerPage = 15;
    const totalPages = Math.ceil(totalUsers / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedLeaderboard = leaderboard.slice(startIndex, endIndex);

    return (
        <div className="w-full h-full p-6 overflow-hidden">
            <div className="flex gap-6 h-full">
                <div className="flex-1 flex flex-col">
                    <RankSelector
                        selectedRank={selectedRank}
                        onRankChange={(rank) => {
                            setSelectedRank(rank);
                            setPage(1);
                        }}
                    />
                    <Card className="flex-1 flex flex-col">
                        <CardContent className="p-0 flex-1 flex flex-col">
                            <div className="flex-1 overflow-auto">
                                <LeaderboardList
                                    leaderboard={paginatedLeaderboard}
                                    currentUserId={currentUserId}
                                />
                            </div>
                            <LeaderboardPagination
                                page={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                                totalUsers={totalUsers}
                                currentCount={paginatedLeaderboard.length}
                                itemsPerPage={itemsPerPage}
                            />
                        </CardContent>
                    </Card>
                </div>
                <div className="w-96 flex flex-col">
                    <div className="h-6"></div>
                    {userPosition && (
                        <MyCurrentRank
                            rank={userPosition.currentRank}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
