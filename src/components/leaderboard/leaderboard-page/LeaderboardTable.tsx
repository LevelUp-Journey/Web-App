"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { useLeaderboardData } from "@/hooks/use-leaderboard-data";
import { getLeaderboardColumns } from "./leaderboard-columns";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

interface LeaderboardTableProps {
    selectedRank: string;
}

export function LeaderboardTable({ selectedRank }: LeaderboardTableProps) {
    const {
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
    } = useLeaderboardData(selectedRank);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <Spinner className="size-8 mb-4" />
                <p className="text-muted-foreground">Loading leaderboard...</p>
            </div>
        );
    }

    if (usersWithProfiles.length === 0) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <AlertCircle />
                    </EmptyMedia>
                    <EmptyTitle>No users found</EmptyTitle>
                    <EmptyDescription>
                        No users found for this rank. Try selecting a different
                        rank.
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button onClick={() => window.location.reload()} variant="outline">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Retry
                    </Button>
                </EmptyContent>
            </Empty>
        );
    }

    return (
        <div className="space-y-4">
            <DataTable
                columns={getLeaderboardColumns(selectedRank)}
                data={usersWithProfiles}
                loading={loading}
                emptyMessage="No users found for this rank"
                pageIndex={currentPage}
                pageCount={totalPages}
                onPreviousPage={handlePrevPage}
                onNextPage={handleNextPage}
                onFirstPage={handleFirstPage}
                onLastPage={handleLastPage}
                canPreviousPage={hasPrevPage}
                canNextPage={hasNextPage}
            />
        </div>
    );
}
