import { RankIcon } from "./rank-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RankSelectorProps {
    selectedRank: string | null;
    onRankChange: (rank: string | null) => void;
}

const ranks = [
    { name: "ALL", value: null, label: "Top" },
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
            <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-lg p-8 mb-4 overflow-hidden border border-slate-700">
                {/* Decorative background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)'
                    }} />
                </div>

                {/* Content */}
                <div className="relative flex items-center justify-center gap-6">
                    {currentRank.value && (
                        <RankIcon rank={currentRank.value} className="h-24 w-24" />
                    )}
                    <div className="text-center">
                        <h2 className="text-5xl font-bold text-white tracking-wider mb-2">
                            {currentRank.value ? currentRank.label.toUpperCase() : "LEADERBOARD"}
                        </h2>
                    </div>
                </div>
            </div>

            {/* Selector de rangos */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {ranks.map((rank) => (
                    <Button
                        key={rank.name}
                        variant={selectedRank === rank.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => onRankChange(rank.value)}
                        className={cn(
                            "flex items-center gap-2 flex-shrink-0 transition-all",
                            selectedRank === rank.value && "ring-2 ring-primary ring-offset-2"
                        )}
                    >
                        {rank.value && (
                            <RankIcon rank={rank.value} className="h-5 w-5" />
                        )}
                        <span className="font-medium">{rank.label}</span>
                    </Button>
                ))}
            </div>
        </div>
    );
}
