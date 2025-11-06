"use client";

import { EllipsisVertical, Star } from "lucide-react";
import Link from "next/link";
import ChallengeDifficultyBadge from "@/components/cards/challenge-difficulty-badge";
import FullLanguageBadge from "@/components/cards/full-language-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProgrammingLanguage } from "@/lib/consts";
import { PATHS } from "@/lib/paths";
import { cn } from "@/lib/utils";
import type { Challenge } from "@/services/internal/challenges/challenge/entities/challenge.entity";
import type { CodeVersion } from "@/services/internal/challenges/challenge/entities/code-version.entity";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface ChallengeCardProps extends React.ComponentProps<"div"> {
    challenge: Challenge;
    codeVersions: CodeVersion[];
    adminMode?: boolean;
}

export default function ChallengeCard({
    challenge,
    codeVersions,
    adminMode = false,
    className,
    ...props
}: ChallengeCardProps) {
    return (
        <Card
            key={challenge.id}
            className={cn("hover:shadow-lg transition-shadow gap-4", className)}
            {...props}
        >
            <CardHeader className="flex items-center justify-between flex-row">
                <CardTitle className="flex items-center justify-between">
                    <Link
                        href={PATHS.DASHBOARD.CHALLENGES.VIEW(challenge.id)}
                        className="hover:underline"
                    >
                        {challenge.name}
                    </Link>
                </CardTitle>
                <div className="flex gap-2">
                    <div className="flex items-center gap-2">
                        <Button size={"icon"} variant={"ghost"}>
                            <Star className="text-yellow-400" size={18} />
                        </Button>
                        {challenge.stars.length}
                    </div>
                    {adminMode && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size={"icon"} variant={"ghost"}>
                                    <EllipsisVertical />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={PATHS.DASHBOARD.CHALLENGES.VIEW(
                                            challenge.id,
                                        )}
                                    >
                                        Edit Challenge
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Delete Challenge
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2 mb-2">
                    <ChallengeDifficultyBadge difficulty={challenge.difficulty} />
                </div>
                <div className="flex flex-wrap gap-2">
                    {codeVersions.map((version) => (
                        <FullLanguageBadge
                            key={version.id}
                            language={version.language as ProgrammingLanguage}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
