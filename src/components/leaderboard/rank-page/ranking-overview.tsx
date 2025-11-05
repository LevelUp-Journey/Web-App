export function RankingOverview({ className = "" }: { className?: string }) {
    return (
        <section
            className={`w-full ${className}`}
            aria-labelledby="ranking-overview-heading"
        >
            <h2
                id="ranking-overview-heading"
                className="text-2xl font-semibold mb-4"
            >
                Overview
            </h2>

            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                The ranking system in LevelUp Journey transforms coding progress
                into a competitive game experience, where every challenge,
                solution, and achievement contributes to a player's growth
                across seven mastery levels. Each user begins as a Bronze Coder
                with a base score of 1000 points, and through consistent
                participation, problem-solving, and excellence, they climb
                toward the elite tier of Grandmaster.
            </p>
        </section>
    );
}

export default RankingOverview;
