import { TrendingDown } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { TopFailedChallenge } from "@/services/internal/analytics/entities/analytics.entity";

interface TopFailedChallengesCardProps {
    topFailedChallenges: TopFailedChallenge[];
    lang: string;
}

export function TopFailedChallengesCard({
    topFailedChallenges,
    lang,
}: TopFailedChallengesCardProps) {
    if (topFailedChallenges.length === 0) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5" />
                    {lang === "es"
                        ? "Desafíos con más fallos"
                        : "Top Failed Challenges"}
                </CardTitle>
                <CardDescription>
                    {lang === "es"
                        ? "Desafíos que requieren más atención"
                        : "Challenges that need more attention"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {topFailedChallenges.map((challenge, index) => (
                        <div
                            key={challenge.challenge_id}
                            className="flex items-center justify-between border-b pb-2 last:border-0"
                        >
                            <div>
                                <p className="font-medium">
                                    #{index + 1} Challenge
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    ID: {challenge.challenge_id.substring(0, 8)}...
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-red-600">
                                    {challenge.success_rate.toFixed(1)}%
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {challenge.total_executions}{" "}
                                    {lang === "es" ? "intentos" : "attempts"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
