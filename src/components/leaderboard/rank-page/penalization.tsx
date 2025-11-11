import type { Dictionary } from "@/app/[lang]/dictionaries";

export function Penalization({
    className = "",
    dict,
}: {
    className?: string;
    dict: Dictionary;
}) {
    return (
        <section
            className={`w-full ${className}`}
            aria-labelledby="penalization-heading"
        >
            <h3
                id="penalization-heading"
                className="text-xl font-semibold mb-4"
            >
                {dict.leaderboard.rankingSystem.penalization.title}
            </h3>

            <ul className="list-disc pl-5 space-y-3 text-sm text-muted-foreground">
                <li>
                    {dict.leaderboard.rankingSystem.penalization.description}
                </li>
            </ul>
        </section>
    );
}

export default Penalization;
