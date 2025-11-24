import type { Dictionary } from "@/app/[lang]/dictionaries";

const DIFFICULTY_LEVELS = [
    { key: "easy", label: "EASY", points: 5 },
    { key: "medium", label: "MEDIUM", points: 10 },
    { key: "hard", label: "HARD", points: 20 },
    { key: "expert", label: "EXPERT", points: 40 },
];

export function GeneralRules({
    className = "",
    dict,
}: {
    className?: string;
    dict: Dictionary;
}) {
    return (
        <section
            className={`w-full ${className}`}
            aria-labelledby="general-rules-heading"
        >
            <h2 id="general-rules-heading" className="text-2xl font-bold mb-6">
                {dict.leaderboard.rankingSystem.rules.title}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
                {dict.leaderboard.rankingSystem.rules.description}
            </p>

            <div className="mb-6 flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
                <p className="w-full text-sm text-muted-foreground mb-2">
                    {dict.leaderboard.rankingSystem.rules.maximumScoresIntro}
                </p>
                {DIFFICULTY_LEVELS.map((level) => (
                    <span
                        key={level.key}
                        className="rounded-full bg-muted px-3 py-1 text-[11px] uppercase tracking-wide"
                    >
                        {
                            dict.leaderboard.rankingSystem.rules
                                .difficultyLevels[
                                level.key as keyof typeof dict.leaderboard.rankingSystem.rules.difficultyLevels
                            ]
                        }
                    </span>
                ))}
            </div>
        </section>
    );
}

export default GeneralRules;
