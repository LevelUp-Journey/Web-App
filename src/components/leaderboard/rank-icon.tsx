import React from "react";

interface RankIconProps {
    rank: string;
    className?: string;
}

const rankSvgMap: Record<string, string> = {
    bronze: "/ranks/rank-bronze.svg",
    silver: "/ranks/rank-silver.svg",
    gold: "/ranks/rank-gold.svg",
    platinum: "/ranks/rank-platinum.svg",
    platinium: "/ranks/rank-platinium.svg", // Legacy support
    diamond: "/ranks/rank-diamond.svg",
    master: "/ranks/rank-master.svg",
    grandmaster: "/ranks/rank-grandmaster.svg",
    top: "/ranks/rank-top.svg",
};

export function RankIcon({ rank, className = "h-6 w-6" }: RankIconProps) {
    const normalizedRank = rank.toLowerCase().replace(/\s+/g, "");
    const svgPath = rankSvgMap[normalizedRank] || rankSvgMap.bronze;

    return <img src={svgPath} alt={`${rank} rank`} className={className} />;
}
