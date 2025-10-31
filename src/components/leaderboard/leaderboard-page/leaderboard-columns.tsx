import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
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
): ColumnDef<UserWithProfile>[] => [
    {
        accessorKey: "position",
        header: "Position",
        cell: ({ row }) => {
            const position =
                selectedRank === "TOP500"
                    ? (row.original as any).position
                    : row.original.leaderboardPosition || "-";
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
            const username =
                row.original.profile?.username ||
                row.original.userId.substring(0, 20);
            return <div className="font-medium">{username}</div>;
        },
    },
    {
        accessorKey: "totalPoints",
        header: () => <div className="text-center">Points</div>,
        cell: ({ row }) => {
            return (
                <div className="text-center font-semibold">
                    {row.original.totalPoints.toLocaleString()}
                </div>
            );
        },
    },
];
