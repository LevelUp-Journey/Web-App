import React from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface RankInfo {
    name: string;
    icon: string;
    scoreRange: string;
}

const RANKS: RankInfo[] = [
    {
        name: "Grandmaster",
        icon: "/ranks/rank-grandmaster.svg",
        scoreRange: "1500"
    },
    {
        name: "Master",
        icon: "/ranks/rank-master.svg",
        scoreRange: "1400"
    },
    {
        name: "Diamond",
        icon: "/ranks/rank-diamond.svg",
        scoreRange: "1300"
    },
    {
        name: "Platinum",
        icon: "/ranks/rank-platinum.svg",
        scoreRange: "1150"
    },
    {
        name: "Gold",
        icon: "/ranks/rank-gold.svg",
        scoreRange: "900"
    },
    {
        name: "Silver",
        icon: "/ranks/rank-silver.svg",
        scoreRange: "500"
    },
    {
        name: "Bronze",
        icon: "/ranks/rank-bronze.svg",
        scoreRange: "0"
    }
];

export function RankIconsTable() {
    return (
        <div className="w-full">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold">Rank</TableHead>
                        <TableHead className="font-bold">Score Range</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {RANKS.map((rank) => (
                        <TableRow key={rank.name}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={rank.icon}
                                        alt={`Rank ${rank.name}`}
                                        className="w-6 h-6"
                                    />
                                    <span>{rank.name}</span>
                                </div>
                            </TableCell>
                            <TableCell className="font-medium">
                                {rank.scoreRange}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}