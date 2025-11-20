import { Clock } from "lucide-react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { CHALLENGE_DIFFICULTY_MAX_XP } from "@/lib/consts";

export function ScoringSystemInfo({
    className = "",
    dict,
}: {
    className?: string;
    dict: Dictionary;
}) {
    // @ts-ignore - timeBasedScoring will be available after i18n update
    const timeBasedScoring = dict.leaderboard?.rankingSystem?.rules?.timeBasedScoring || {
        title: "Sistema de Puntuación por Tiempo",
        description: "Cada dificultad tiene rangos de tiempo específicos. No son globales.",
        groups: {
            easy: {
                title: "EASY",
                rules: ["≤ 20 min → 100%", "≤ 30 min → 80%", "≤ 40 min → 60%", "> 40 min → 20%"]
            },
            medium: {
                title: "MEDIUM",
                rules: ["≤ 40 min → 100%", "≤ 60 min → 80%", "≤ 80 min → 60%", "> 80 min → 20%"]
            },
            hard: {
                title: "HARD",
                rules: ["≤ 90 min → 100%", "≤ 120 min → 80%", "≤ 150 min → 60%", "> 150 min → 20%"]
            },
            expert: {
                title: "EXPERT",
                rules: ["≤ 180 min → 100%", "≤ 240 min → 80%", "≤ 300 min → 60%", "> 300 min → 20%"]
            }
        }
    };

    // map short keys to the configured maximum XP per difficulty
    const maxByKey: Record<string, number> = {
        easy: CHALLENGE_DIFFICULTY_MAX_XP.EASY,
        medium: CHALLENGE_DIFFICULTY_MAX_XP.MEDIUM,
        hard: CHALLENGE_DIFFICULTY_MAX_XP.HARD,
        expert: CHALLENGE_DIFFICULTY_MAX_XP.EXPERT,
    };

    return (
        <section
            className={`w-full ${className}`}
            aria-labelledby="scoring-system-heading"
        >
            <h2 id="scoring-system-heading" className="text-2xl font-bold mb-6">
                {timeBasedScoring.title}
            </h2>

            <p className="text-sm text-muted-foreground mb-6">
                {timeBasedScoring.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* EASY */}
                <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-green-600 mb-2">
                        {timeBasedScoring.groups.easy.title}
                    </h4>
                    <div className="text-xs text-muted-foreground mb-2">Max: {maxByKey.easy} pts</div>
                    <div className="text-sm space-y-1">
                        {timeBasedScoring.groups.easy.rules.map((rule: string, index: number) => (
                            <div key={index}>{rule}</div>
                        ))}
                    </div>
                </div>

                {/* MEDIUM */}
                <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-blue-600 mb-2">
                        {timeBasedScoring.groups.medium.title}
                    </h4>
                    <div className="text-xs text-muted-foreground mb-2">Max: {maxByKey.medium} pts</div>
                    <div className="text-sm space-y-1">
                        {timeBasedScoring.groups.medium.rules.map((rule: string, index: number) => (
                            <div key={index}>{rule}</div>
                        ))}
                    </div>
                </div>

                {/* HARD */}
                <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-orange-600 mb-2">
                        {timeBasedScoring.groups.hard.title}
                    </h4>
                    <div className="text-xs text-muted-foreground mb-2">Max: {maxByKey.hard} pts</div>
                    <div className="text-sm space-y-1">
                        {timeBasedScoring.groups.hard.rules.map((rule: string, index: number) => (
                            <div key={index}>{rule}</div>
                        ))}
                    </div>
                </div>

                {/* EXPERT */}
                <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-red-600 mb-2">
                        {timeBasedScoring.groups.expert.title}
                    </h4>
                    <div className="text-xs text-muted-foreground mb-2">Max: {maxByKey.expert} pts</div>
                    <div className="text-sm space-y-1">
                        {timeBasedScoring.groups.expert.rules.map((rule: string, index: number) => (
                            <div key={index}>{rule}</div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ScoringSystemInfo;