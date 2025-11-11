import Image from "next/image";
import type { Dictionary } from "@/app/[lang]/dictionaries";

type Rank = {
    id: number;
    name: string;
    file: string;
};

const RANKS: Rank[] = [
    { id: 1, name: "Bronze", file: "/ranks-trophies/trophy-bronze.svg" },
    { id: 2, name: "Silver", file: "/ranks-trophies/trophy-silver.svg" },
    { id: 3, name: "Gold", file: "/ranks-trophies/trophy-gold.svg" },
    { id: 4, name: "Platinum", file: "/ranks-trophies/trophy-platinum.svg" },
    { id: 5, name: "Diamond", file: "/ranks-trophies/trophy-diamond.svg" },
    { id: 6, name: "Master", file: "/ranks-trophies/trophy-master.svg" },
    {
        id: 7,
        name: "Grandmaster",
        file: "/ranks-trophies/trophy-grandmaster.svg",
    },
];

export function RanksList({
    className = "",
    dict,
}: {
    className?: string;
    dict: Dictionary;
}) {
    return (
        <section
            className={"w-full " + className}
            aria-labelledby="ranks-heading"
        >
            <h2 id="ranks-heading" className="text-lg font-semibold mb-4">
                {dict.leaderboard.ui.rankingSystem}
            </h2>

            <div className="p-4 rounded-lg bg-muted/20 border border-muted">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 items-end">
                    {RANKS.map((rank) => (
                        <div
                            key={rank.id}
                            className="flex flex-col items-center text-center"
                        >
                            <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 p-2 flex items-center justify-center">
                                <Image
                                    src={rank.file}
                                    alt={`${rank.name} trophy`}
                                    width={128}
                                    height={128}
                                    className="max-w-full max-h-full"
                                    unoptimized
                                />
                            </div>
                            <span className="mt-2 text-xs sm:text-sm font-medium uppercase tracking-wider">
                                {rank.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default RanksList;
