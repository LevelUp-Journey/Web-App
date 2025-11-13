import { Play } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/hooks/use-dictionary";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import type { Challenge } from "@/services/internal/challenges/challenge/entities/challenge.entity";

interface GuideChallengesProps {
    challenges: Challenge[];
}

export function GuideChallenges({ challenges }: GuideChallengesProps) {
    const dict = useDictionary();
    const PATHS = useLocalizedPaths();

    if (challenges.length === 0) {
        return null;
    }

    return (
        <div className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-bold mb-6">
                {dict?.guides?.viewer?.practiceSection ||
                    "Now you're ready to put it into practice:"}
            </h2>
            <div className="space-y-4">
                {challenges.map((challenge) => (
                    <div
                        key={challenge.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                        <div className="flex-1">
                            <h3 className="font-semibold">{challenge.name}</h3>
                            <p className="text-sm text-muted-foreground">
                                {challenge.experiencePoints} XP •{" "}
                                {challenge.difficulty || "Unknown"} •{" "}
                                {challenge.tags
                                    .map((tag) => tag.name)
                                    .join(", ") || "No tags"}
                            </p>
                        </div>
                        <Button asChild variant="outline">
                            <Link
                                href={PATHS.DASHBOARD.CHALLENGES.VIEW(
                                    challenge.id,
                                )}
                                className="flex items-center gap-2"
                            >
                                <Play className="h-4 w-4" />
                                {dict?.guides?.viewer?.startChallenge ||
                                    "Start Challenge"}
                            </Link>
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
