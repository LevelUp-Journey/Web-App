import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { UserWithProfile } from "@/hooks/use-leaderboard-data";

const RANK_ICONS: Record<string, string> = {
    BRONZE: "/ranks/rank-bronze.svg",
    SILVER: "/ranks/rank-silver.svg",
    GOLD: "/ranks/rank-gold.svg",
    PLATINUM: "/ranks/rank-platinum.svg",
    DIAMOND: "/ranks/rank-diamond.svg",
    MASTER: "/ranks/rank-master.svg",
    GRANDMASTER: "/ranks/rank-grandmaster.svg",
};

export const getLeaderboardColumns = (
    selectedRank: string,
    dict: Dictionary,
): ColumnDef<UserWithProfile>[] => [
    {
        accessorKey: "position",
        header: dict.leaderboard.table.position,
        cell: ({ row }) => {
            const position =
                selectedRank === "TOP500"
                    ? row.original.position
                    : row.original.leaderboardPosition;
            const value = typeof position === "number" ? position : "-";
            return <div className="font-mono font-medium">#{value}</div>;
        },
    },
    {
        accessorKey: "currentRank",
        header: dict.leaderboard.table.rank,
        cell: ({ row }) => {
            const rank = row.original.currentRank || "BRONZE";
            return (
                <div className="flex items-center gap-2">
                    <Image
                        src={RANK_ICONS[rank]}
                        alt={rank}
                        width={48}
                        height={48}
                        className="w-12 h-12 object-contain"
                        unoptimized
                    />
                </div>
            );
        },
    },
    {
        accessorKey: "username",
        header: dict.leaderboard.table.username,
        cell: ({ row }) => {
            return (
                <div className="font-mono font-medium">
                    {row.original.username}
                </div>
            );
        },
    },
    {
        accessorKey: "totalPoints",
        header: () => (
            <div className="text-center font-mono">
                {dict.leaderboard.table.points}
            </div>
        ),
        cell: ({ row }) => {
            return (
                <div className="text-center font-mono font-medium">
                    {row.original.totalPoints.toLocaleString()}
                </div>
            );
        },
    },
];
