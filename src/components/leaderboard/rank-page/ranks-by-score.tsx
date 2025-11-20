import Image from "next/image";
import type { Dictionary } from "@/app/[lang]/dictionaries";

type RankItem = {
    key: string;
    name: string;
    file: string;
    range: string;
};

const RANKS: RankItem[] = [
    {
        key: "bronze",
        name: "Bronze",
        file: "/ranks-trophies/trophy-bronze.webp",
        range: "0 – 499",
    },
    {
        key: "silver",
        name: "Silver",
        file: "/ranks-trophies/trophy-silver.webp",
        range: "500 – 899",
    },
    {
        key: "gold",
        name: "Gold",
        file: "/ranks-trophies/trophy-gold.webp",
        range: "900 – 1149",
    },
    {
        key: "platinum",
        name: "Platinum",
        file: "/ranks-trophies/trophy-platinum.webp",
        range: "1150 – 1299",
    },
    {
        key: "diamond",
        name: "Diamond",
        file: "/ranks-trophies/trophy-diamond.webp",
        range: "1300 – 1399",
    },
    {
        key: "master",
        name: "Master",
        file: "/ranks-trophies/trophy-master.webp",
        range: "1400 – 1499",
    },
    {
        key: "grandmaster",
        name: "Grandmaster",
        file: "/ranks-trophies/trophy-grandmaster.webp",
        range: "1500 +",
    },
];

export function RanksByScore({
    className = "",
    dict,
}: {
    className?: string;
    dict: Dictionary;
}) {
    return (
        <section className={`w-full ${className}`} aria-label="Ranks by score">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 items-end">
                {RANKS.map((r) => (
                    <div
                        key={r.key}
                        className="flex flex-col items-center text-center"
                    >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 p-1 rounded-md flex items-center justify-center">
                            <Image
                                src={r.file}
                                alt={`${dict.leaderboard.ranks[r.key as keyof typeof dict.leaderboard.ranks].name} trophy`}
                                width={96}
                                height={96}
                                className="max-w-full max-h-full"
                                unoptimized
                            />
                        </div>
                        <div className="mt-2 text-sm font-medium">{dict.leaderboard.ranks[r.key as keyof typeof dict.leaderboard.ranks].name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                            {
                                dict.leaderboard.rankingSystem.byScore.ranges[
                                    r.key as keyof typeof dict.leaderboard.rankingSystem.byScore.ranges
                                ]
                            }
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default RanksByScore;
