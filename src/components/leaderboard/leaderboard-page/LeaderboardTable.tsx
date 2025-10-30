"use client";

import { useLeaderboardData } from "@/hooks/use-leaderboard-data";
import { getLeaderboardColumns } from "./leaderboard-columns";
import { DataTable } from "@/components/ui/data-table";

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
        return <div className="text-center py-8">Loading...</div>;
    }

    if (usersWithProfiles.length === 0) {
        return <div className="text-center py-8">No users found for this rank</div>;
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
