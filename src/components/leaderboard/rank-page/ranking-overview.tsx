import type { Dictionary } from "@/app/[lang]/dictionaries";

export function RankingOverview({
    className = "",
    dict,
}: {
    className?: string;
    dict: Dictionary;
}) {
    return (
        <section
            className={`w-full ${className}`}
            aria-labelledby="ranking-overview-heading"
        >
            <h1
                id="ranking-overview-heading"
                className="text-3xl font-bold mb-6"
            >
                {dict.leaderboard.rankingSystem.overview.title}
            </h1>

            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {dict.leaderboard.rankingSystem.overview.description}
            </p>
        </section>
    );
}

export default RankingOverview;
