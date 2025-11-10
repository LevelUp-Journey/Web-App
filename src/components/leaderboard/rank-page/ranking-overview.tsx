import type { Dictionary } from "@/app/[lang]/dictionaries";

export function RankingOverview({ className = "", dict }: { className?: string; dict: Dictionary }) {
    return (
        <section
            className={`w-full ${className}`}
            aria-labelledby="ranking-overview-heading"
        >
            <h2
                id="ranking-overview-heading"
                className="text-2xl font-semibold mb-4"
            >
                {dict.leaderboard.rankingSystem.overview.title}
            </h2>

            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {dict.leaderboard.rankingSystem.overview.description}
            </p>
        </section>
    );
}

export default RankingOverview;
