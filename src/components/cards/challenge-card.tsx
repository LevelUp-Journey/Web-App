"use client";

import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import FullLanguageBadge from "@/components/cards/full-language-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { ProgrammingLanguage } from "@/lib/consts";
import { PATHS } from "@/lib/paths";
import type { Challenge } from "@/services/internal/challenges/challenge/entities/challenge.entity";
import type { CodeVersion } from "@/services/internal/challenges/challenge/entities/code-version.entity";

interface ChallengeCardProps {
    challenge: Challenge;
    codeVersions: CodeVersion[];
    adminMode?: boolean;
}

export default function ChallengeCard({
    challenge,
    codeVersions,
    adminMode = false,
}: ChallengeCardProps) {
    const router = useRouter();

    return (
        <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex items-center justify-between flex-row">
                <CardTitle className="flex items-center justify-between">
                    {challenge.name}
                </CardTitle>
                <div className="flex items-center gap-2 ">
                    <Button size={"icon"} variant={"ghost"}>
                        <Star className="text-yellow-400" size={18} />
                    </Button>
                    {challenge.stars.length}
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                    {challenge.tags.map((tag) => (
                        <Badge
                            key={tag.id}
                            style={{
                                backgroundColor: tag.color,
                            }}
                        >
                            {tag.name}
                        </Badge>
                    ))}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {codeVersions.map((version) => (
                        <FullLanguageBadge
                            key={version.id}
                            language={version.language as ProgrammingLanguage}
                        />
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                {adminMode ? (
                    <Button
                        size="sm"
                        onClick={() => {
                            router.push(
                                PATHS.DASHBOARD.CHALLENGES.VIEW(challenge.id),
                            );
                        }}
                    >
                        View
                    </Button>
                ) : (
                    <Button
                        size="sm"
                        onClick={() => {
                            router.push(
                                PATHS.DASHBOARD.CHALLENGES.VIEW(challenge.id),
                            );
                        }}
                    >
                        start coding
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
