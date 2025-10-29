import { RankIcon } from "./rank-icon";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu, Check } from "lucide-react";

interface RankSelectorProps {
    selectedRank: string | null;
    onRankChange: (rank: string | null) => void;
}

const ranks = [
    { name: "TOP500", value: "TOP", label: "Top 500" },
    { name: "BRONZE", value: "BRONZE", label: "Bronze" },
    { name: "SILVER", value: "SILVER", label: "Silver" },
    { name: "GOLD", value: "GOLD", label: "Gold" },
    { name: "PLATINUM", value: "PLATINUM", label: "Platinum" },
    { name: "DIAMOND", value: "DIAMOND", label: "Diamond" },
    { name: "MASTER", value: "MASTER", label: "Master" },
    { name: "GRANDMASTER", value: "GRANDMASTER", label: "Grand Master" },
];

export function RankSelector({ selectedRank, onRankChange }: RankSelectorProps) {
    const currentRank = ranks.find((r) => r.value === selectedRank) || ranks[0];

    return (
        <div className="mb-6">
            {/* Header visual con el rango seleccionado */}
            <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-lg p-8 overflow-hidden border border-slate-700">
                {/* Decorative background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)'
                    }} />
                </div>

                {/* Content */}
                <div className="relative flex items-center gap-8">
                    {/* Left side: Rank icon as dropdown trigger */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-20 w-20 hover:bg-slate-700/50 transition-all"
                            >
                                {currentRank.value ? (
                                    <RankIcon rank={currentRank.value} className="h-16 w-16" />
                                ) : (
                                    <Menu className="h-10 w-10 text-white" />
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                            {ranks.map((rank) => (
                                <DropdownMenuItem
                                    key={rank.name}
                                    onClick={() => onRankChange(rank.value)}
                                    className="flex items-center justify-between gap-2 cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        {rank.value ? (
                                            <RankIcon rank={rank.value} className="h-6 w-6" />
                                        ) : (
                                            <div className="h-6 w-6" />
                                        )}
                                        <span className="font-medium">{rank.label}</span>
                                    </div>
                                    {selectedRank === rank.value && (
                                        <Check className="h-4 w-4 text-primary" />
                                    )}
                                    {selectedRank === null && rank.value === "TOP" && (
                                        <Check className="h-4 w-4 text-primary" />
                                    )}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Right side: Rank name */}
                    <div className="flex-1">
                        <h2 className="text-5xl font-bold text-white tracking-wider mb-2">
                            {currentRank.label.toUpperCase()}
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    );
}
