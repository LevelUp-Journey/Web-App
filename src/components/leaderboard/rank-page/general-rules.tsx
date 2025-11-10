const DIFFICULTY_LEVELS = [
    { label: "EASY", points: 5 },
    { label: "MEDIUM", points: 10 },
    { label: "HARD", points: 20 },
    { label: "EXPERT", points: 40 },
];

const SCORING_RULES = [
    {
        title: "Difficulty Sets the Ceiling",
        summary:
            "Every challenge ships with a fixed max score. Difficulty only raises that ceiling — your time determines what you take home.",
        items: [
            "Higher tiers unlock bigger point pools, but also expect longer focus sessions.",
            "Once you know the cap, you can pace your effort to keep the best time window.",
        ],
    },
    {
        title: "Correctness First",
        summary:
            "Scoring is binary on accuracy. Only fully green test suites move on to time-based math.",
        items: [
            "All tests pass → your time tier decides the percentage.",
            "Any failure → 0 points. No partial credit, but the attempt stays on your history.",
        ],
    },
    {
        title: "Time Controls The Percentage",
        summary:
            "Once correctness is locked, the clock slots you into a payout tier relative to the challenge ceiling.",
        items: [
            "Within grace → 100%. Slight delay → 80%. Moderate → 60%. Slow → 40%. Very late → 20%.",
            "Harder challenges stretch grace periods so advanced problems stay fair.",
        ],
    },
    {
        title: "Minimum Guaranteed Score",
        summary:
            "Passing all tests never feels wasted time. Even the slowest clean solution gives back 20% of the challenge cap.",
        items: [
            "Examples: Easy ≥ 1 pt, Medium ≥ 2 pts, Hard ≥ 4 pts, Expert ≥ 8 pts.",
            "Think of it as effort insurance — correctness always counts.",
        ],
    },
    {
        title: "How We Track Time",
        summary:
            "The timer covers the full build-measure-learn loop, not just the final run button.",
        items: [
            "Start when you create the challenge solution. End on the final submission.",
            "Coding, debugging, and retries all count. Internally we store seconds, but show minutes in the UI.",
        ],
    },
    {
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

export function GeneralRules({ className = "" }: { className?: string }) {
    return (
        <section
            className={`w-full ${className}`}
            aria-labelledby="general-rules-heading"
        >
            <h3
                id="general-rules-heading"
                className="text-xl font-semibold mb-4"
            >
                Scoring Rules Overview
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
                Quick guide to how LevelUp Journey translates difficulty, correctness, and time into leaderboard points.
            </p>

            <div className="mb-6 flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
                {DIFFICULTY_LEVELS.map((level) => (
                    <span
                        key={level.label}
                        className="rounded-full bg-muted px-3 py-1 text-[11px] uppercase tracking-wide"
                    >
                        {level.label} → {level.points} pts
                    </span>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {SCORING_RULES.map((rule) => (
                    <article
                        key={rule.title}
                        className="rounded-lg border border-border bg-card/40 p-4 shadow-sm"
                    >
                        <h4 className="text-base font-semibold mb-2">
                            {rule.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                            {rule.summary}
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground/90">
                            {rule.items.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default GeneralRules;
