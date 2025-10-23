"use client";

import {
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";
import { MyCurrentRank } from "@/components/leaderboard/my-current-rank";
import {
    getRankFromPoints,
    RankIcon,
} from "@/components/leaderboard/rank-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useLeaderboardWithUsers } from "@/hooks/use-leaderboard-with-users";
import { getUserIdFromTokenAction } from "@/services/internal/iam/server/auth.actions";
import { LeaderboardController } from "@/services/internal/profiles/leaderboard/controller/leaderboard.controller";

export default function LeaderboardPage() {
    const [page, setPage] = useState(1);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [userPosition, setUserPosition] = useState<{
        position: number;
        totalPoints: number;
    } | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    const itemsPerPage = 15;
    const offset = (page - 1) * itemsPerPage;
    const { leaderboard, loading, error } = useLeaderboardWithUsers(
        itemsPerPage,
        offset,
    );

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
                                <Skeleton className="h-8 w-48 mb-6" />
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
                    <div className="flex items-center justify-center gap-2">
                        <Trophy className="h-8 w-8 text-yellow-500" />
                        <h1 className="text-3xl font-bold">Leaderboard</h1>
                    </div>
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

    const totalPages = Math.ceil(500 / itemsPerPage);

    return (
        <div className="w-full h-full p-6 overflow-hidden">
            <div className="flex gap-6 h-full">
                <div className="flex-1 flex flex-col">
                    <h1 className="text-2xl font-bold mb-6">Leaderboard</h1>
                    <Card className="flex-1 flex flex-col">
                        <CardContent className="p-0 flex-1 flex flex-col">
                            <div className="flex-1 overflow-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-20"></TableHead>
                                            <TableHead className="w-16"></TableHead>
                                            <TableHead>Username</TableHead>
                                            <TableHead className="text-right w-32">
                                                Points
                                            </TableHead>
                                            <TableHead className="text-right w-32">
                                                Challenges
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {leaderboard.map((entry) => (
                                            <TableRow
                                                key={entry.id}
                                                className={
                                                    entry.userId ===
                                                    currentUserId
                                                        ? "bg-primary/10"
                                                        : ""
                                                }
                                            >
                                                <TableCell>
                                                    <Badge
                                                        variant="secondary"
                                                        className="w-12 justify-center"
                                                    >
                                                        {entry.position}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <RankIcon
                                                        rank={getRankFromPoints(
                                                            entry.totalPoints,
                                                        )}
                                                        className="w-8 h-8"
                                                    />
                                                </TableCell>
                                                <TableCell className="font-mono">
                                                    {entry.username ||
                                                        entry.userId.substring(
                                                            0,
                                                            20,
                                                        )}
                                                </TableCell>
                                                <TableCell className="text-right font-mono">
                                                    {entry.totalPoints.toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-right font-mono">
                                                    {entry.totalPoints}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="flex items-center justify-center gap-2 p-4 border-t flex-shrink-0">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        setPage((p) => Math.max(1, p - 1))
                                    }
                                    disabled={page === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Previous
                                </Button>
                                {Array.from(
                                    { length: Math.min(5, totalPages) },
                                    (_, i) => {
                                        const pageNum =
                                            page <= 3 ? i + 1 : page - 2 + i;
                                        if (pageNum > totalPages) return null;
                                        return (
                                            <Button
                                                key={pageNum}
                                                variant={
                                                    page === pageNum
                                                        ? "default"
                                                        : "ghost"
                                                }
                                                size="sm"
                                                onClick={() => setPage(pageNum)}
                                                className="w-10"
                                            >
                                                {pageNum}
                                            </Button>
                                        );
                                    },
                                )}
                                {page < totalPages - 2 && <span>...</span>}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        setPage((p) =>
                                            Math.min(totalPages, p + 1),
                                        )
                                    }
                                    disabled={page === totalPages}
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="w-96 flex flex-col">
                    <div className="h-6"></div>
                    {userPosition && (
                        <MyCurrentRank
                            totalPoints={userPosition.totalPoints}
                            position={userPosition.position}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
