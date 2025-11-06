"use client";

import { EllipsisVertical, Star } from "lucide-react";
import Link from "next/link";
import ChallengeDifficultyBadge from "@/components/cards/challenge-difficulty-badge";
import FullLanguageBadge from "@/components/cards/full-language-badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
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
            className={cn("hover:shadow-lg transition-shadow flex flex-col my-6 mx-6 max-w-xs", className)}
            {...props}
        >
            {/* Badges at the top */}
            <div className="px-3 py-1 pb-0.5">
                <div className="flex flex-wrap gap-1">
                    <ChallengeDifficultyBadge difficulty={challenge.difficulty} />
                    {codeVersions.map((version) => (
                        <FullLanguageBadge
                            key={version.id}
                            language={version.language as ProgrammingLanguage}
                        />
                    ))}
                </div>
            </div>

            {/* Title in the middle */}
            <div className="flex-1 flex items-center px-3 py-0.5">
                <CardTitle className="text-base font-bold">
                    <Link
                        href={PATHS.DASHBOARD.CHALLENGES.VIEW(challenge.id)}
                        className="hover:underline"
                    >
                        {challenge.name}
                    </Link>
                </CardTitle>
            </div>

            {/* Stars at the bottom */}
            <div className="px-3 py-1 pt-0.5 flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <Button size={"sm"} variant={"ghost"} className="h-6 w-6 p-0">
                        <Star className="text-yellow-400" size={14} />
                    </Button>
                    <span className="text-xs">{challenge.stars.length}</span>
                </div>
                {adminMode && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size={"sm"} variant={"ghost"} className="h-6 w-6 p-0">
                                <EllipsisVertical size={14} />
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
        </Card>
    );
}
