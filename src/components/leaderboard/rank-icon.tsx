import React from "react";

interface RankIconProps {
    rank: string;
    className?: string;
}

const rankSvgMap: Record<string, string> = {
    bronze: "/ranks/Bronze.svg",
    silver: "/ranks/Silver.svg",
    gold: "/ranks/Gold.svg",
    platinium: "/ranks/Platinium.svg",
    diamond: "/ranks/Diamond.svg",
    master: "/ranks/Master.svg",
    grandmaster: "/ranks/GrandMaster.svg",
    top: "/ranks/TOP.svg",
};

export function RankIcon({ rank, className = "h-6 w-6" }: RankIconProps) {
    const normalizedRank = rank.toLowerCase().replace(/\s+/g, "");
    const svgPath = rankSvgMap[normalizedRank] || rankSvgMap.bronze;

    return <img src={svgPath} alt={`${rank} rank`} className={className} />;
}

export function getRankFromPoints(points: number): string {
    if (points >= 10000) return "TOP";
    if (points >= 5000) return "GrandMaster";
    if (points >= 2500) return "Master";
    if (points >= 1500) return "Diamond";
    if (points >= 1000) return "Platinium";
    if (points >= 500) return "Gold";
    if (points >= 250) return "Silver";
    return "Bronze";
}
