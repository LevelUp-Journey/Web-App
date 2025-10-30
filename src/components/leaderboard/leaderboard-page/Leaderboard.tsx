"use client";

import { useState } from "react";
import { LeaderboardTable } from "./LeaderboardTable";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";

const RANKS = [
    { key: "BRONZE", name: "Bronze" },
    { key: "SILVER", name: "Silver" },
    { key: "GOLD", name: "Gold" },
    { key: "PLATINUM", name: "Platinum" },
    { key: "DIAMOND", name: "Diamond" },
    { key: "MASTER", name: "Master" },
    { key: "GRANDMASTER", name: "Grandmaster" },
];

export function LeaderboardPage() {
    const [selectedRank, setSelectedRank] = useState("BRONZE");

    const selectedRankName = RANKS.find(rank => rank.key === selectedRank)?.name || "Bronze";

    return (
        <div className="container mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Leaderboard</h1>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                            {selectedRankName}
                            <ChevronDownIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {RANKS.map((rank) => (
                            <DropdownMenuItem
                                key={rank.key}
                                onClick={() => setSelectedRank(rank.key)}
                                className="cursor-pointer"
                            >
                                {rank.name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <LeaderboardTable selectedRank={selectedRank} />
        </div>
    );
}