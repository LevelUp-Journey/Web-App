"use client";

import { useLeaderboardData } from "@/hooks/use-leaderboard-data";
import { getLeaderboardColumns } from "./leaderboard-columns";
import { DataTable } from "@/components/ui/data-table";
import { Spinner } from "@/components/ui/spinner";
import type { Dictionary } from "@/app/[lang]/dictionaries";

interface LeaderboardTableProps {
    selectedRank: string;
    dict: Dictionary;
}

export function LeaderboardTable({ selectedRank, dict }: LeaderboardTableProps) {
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
                <p className="text-muted-foreground">{dict.leaderboard.loading.leaderboard}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <DataTable
                columns={getLeaderboardColumns(selectedRank, dict)}
                data={usersWithProfiles}
                loading={loading}
                emptyMessage={dict.leaderboard.empty.noUsers}
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
