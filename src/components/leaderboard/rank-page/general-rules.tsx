import type { Dictionary } from "@/app/[lang]/dictionaries";

const DIFFICULTY_LEVELS = [
    { key: "easy", label: "EASY", points: 5 },
    { key: "medium", label: "MEDIUM", points: 10 },
    { key: "hard", label: "HARD", points: 20 },
    { key: "expert", label: "EXPERT", points: 40 },
];

const SCORING_RULES = [
    {
        key: "difficultyCeiling",
        title: "Difficulty Sets the Ceiling",
        summary:
            "Every challenge ships with a fixed max score. Difficulty only raises that ceiling — your time determines what you take home.",
        items: [
            "Higher tiers unlock bigger point pools, but also expect longer focus sessions.",
            "Once you know the cap, you can pace your effort to keep the best time window.",
        ],
    },
    {
        key: "correctnessFirst",
        title: "Correctness First",
        summary:
            "Scoring is binary on accuracy. Only fully green test suites move on to time-based math.",
        items: [
            "All tests pass → your time tier decides the percentage.",
            "Any failure → 0 points. No partial credit, but the attempt stays on your history.",
        ],
    },
    {
        key: "timePercentage",
        title: "Time Controls The Percentage",
        summary:
            "Once correctness is locked, the clock slots you into a payout tier relative to the challenge ceiling.",
        items: [
            "Within grace → 100%. Slight delay → 80%. Moderate → 60%. Slow → 40%. Very late → 20%.",
            "Harder challenges stretch grace periods so advanced problems stay fair.",
        ],
    },
    {
        key: "minimumScore",
        title: "Minimum Guaranteed Score",
        summary:
            "Passing all tests never feels wasted time. Even the slowest clean solution gives back 20% of the challenge cap.",
        items: [
            "Examples: Easy ≥ 1 pt, Medium ≥ 2 pts, Hard ≥ 4 pts, Expert ≥ 8 pts.",
            "Think of it as effort insurance — correctness always counts.",
        ],
    },
    {
        key: "timeTracking",
        title: "How We Track Time",
        summary:
            "The timer covers the full build-measure-learn loop, not just the final run button.",
        items: [
            "Start when you create the challenge solution. End on the final submission.",
            "Coding, debugging, and retries all count. Internally we store seconds, but show minutes in the UI.",
        ],
    },
    {
        key: "summaryHierarchy",
        title: "Summary Hierarchy",
        summary:
            "Two-step mental checklist: be correct, then be timely. Everything else flows from there.",
        items: [
            "Pass all tests + stay inside time → max score.",
            "Pass all tests + miss time → reduced score.",
            "Fail any test → zero score regardless of time.",
        ],
    },
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
            <h3
                id="general-rules-heading"
                className="text-xl font-semibold mb-4"
            >
                {dict.leaderboard.rankingSystem.rules.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
                {dict.leaderboard.rankingSystem.rules.description}
            </p>

            <div className="mb-6 flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
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

            <div className="grid gap-4 md:grid-cols-2">
                {SCORING_RULES.map((rule) => {
                    const sectionKey =
                        rule.key as keyof typeof dict.leaderboard.rankingSystem.rules.sections;
                    const section =
                        dict.leaderboard.rankingSystem.rules.sections[
                            sectionKey
                        ];
                    return (
                        <article
                            key={rule.key}
                            className="rounded-lg border border-border bg-card/40 p-4 shadow-sm"
                        >
                            <h4 className="text-base font-semibold mb-2">
                                {section.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-3">
                                {section.summary}
                            </p>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground/90">
                                {section.items.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}

export default GeneralRules;
