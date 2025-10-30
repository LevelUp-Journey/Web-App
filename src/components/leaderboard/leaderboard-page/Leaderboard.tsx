"use client";

import { useState } from "react";
import Image from "next/image";
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
    { key: "TOP500", name: "Top 500", icon: "/ranks-trophies/trophy-grandmaster.svg" }, // Using grandmaster trophy as icon
    { key: "BRONZE", name: "Bronze", icon: "/ranks/rank-bronze.svg" },
    { key: "SILVER", name: "Silver", icon: "/ranks/rank-silver.svg" },
    { key: "GOLD", name: "Gold", icon: "/ranks/rank-gold.svg" },
    { key: "PLATINUM", name: "Platinum", icon: "/ranks/rank-platinum.svg" },
    { key: "DIAMOND", name: "Diamond", icon: "/ranks/rank-diamond.svg" },
    { key: "MASTER", name: "Master", icon: "/ranks/rank-master.svg" },
    { key: "GRANDMASTER", name: "Grandmaster", icon: "/ranks/rank-grandmaster.svg" },
];

export function LeaderboardPage() {
    const [selectedRank, setSelectedRank] = useState("TOP500");

    const selectedRankData = RANKS.find(rank => rank.key === selectedRank) || RANKS[0];

    return (
        <div className="container mx-auto p-6">
            <div className="flex items-center justify-between mb-6">

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Image
                                src={selectedRankData.icon}
                                alt={selectedRankData.name}
                                width={20}
                                height={20}
                                className="w-5 h-5"
                                unoptimized
                            />
                            {selectedRankData.name}
                            <ChevronDownIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {RANKS.map((rank) => (
                            <DropdownMenuItem
                                key={rank.key}
                                onClick={() => setSelectedRank(rank.key)}
                                className="cursor-pointer flex items-center gap-2"
                            >
                                <Image
                                    src={rank.icon}
                                    alt={rank.name}
                                    width={16}
                                    height={16}
                                    className="w-4 h-4"
                                    unoptimized
                                />
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