"use client";

import type { SerializeResult } from "next-mdx-remote-client/csr";
import ChallengeDifficultyBadge from "@/components/cards/challenge-difficulty-badge";
import FullLanguageBadge from "@/components/cards/full-language-badge";
import CodeVersionsList from "@/components/challenges/code-versions-list";
import MdxRenderer from "@/components/challenges/mdx-renderer";
import PublishButton from "@/components/challenges/publish-button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useDictionary } from "@/hooks/use-dictionary";
import {
    ChallengeDifficulty,
    ChallengeStatus,
    type ProgrammingLanguage,
} from "@/lib/consts";
import type { Challenge } from "@/services/internal/challenges/challenge/entities/challenge.entity";
import type { CodeVersion } from "@/services/internal/challenges/challenge/entities/code-version.entity";

interface ChallengeSummaryProps {
    challenge: Challenge;
    codeVersions: CodeVersion[];
    serializedMarkdown: SerializeResult | null;
    isTeacher: boolean;
}

export default function ChallengeSummary({
    challenge,
    codeVersions,
    serializedMarkdown,
    isTeacher,
}: ChallengeSummaryProps) {
    const dict = useDictionary();
    return (
        <section className="flex flex-col p-4 w-full max-w-4xl mx-auto">
            {/* Status Indicator */}
            {isTeacher && (
                <div className="text-sm text-muted-foreground mb-4">
                    <strong>
                        {dict?.challenges?.messages?.summary?.status ||
                            "Status:"}
                    </strong>{" "}
                    {challenge.status}
                </div>
            )}

            {/* Header Card */}
            <Card className="shrink-0 mb-6">
                <CardHeader className="pb-4">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4 justify-between items-center">
                        <div className="flex flex-wrap gap-2">
                            <ChallengeDifficultyBadge
                                difficulty={
                                    challenge.difficulty ??
                                    ChallengeDifficulty.EASY
                                }
                            />
                            {codeVersions.map((version) => (
                                <FullLanguageBadge
                                    key={version.id}
                                    language={
                                        version.language as ProgrammingLanguage
                                    }
                                />
                            ))}
                        </div>
                        {isTeacher && (
                            <div className="text-sm text-muted-foreground">
                                <strong>
                                    {dict?.challenges?.messages?.summary?.xp ||
                                        "XP:"}
                                </strong>{" "}
                                {challenge.experiencePoints}
                            </div>
                        )}
                    </div>

                    {/* Title and Actions */}
                    <div className="flex justify-between items-start mb-4">
                        <CardTitle className="text-3xl font-bold">
                            {challenge.name}
                        </CardTitle>

                        {/* Teacher Actions */}
                        {isTeacher && (
                            <div className="flex gap-2 items-center ml-4">
                                {challenge.status !==
                                    ChallengeStatus.PUBLISHED && (
                                    <PublishButton challengeId={challenge.id} />
                                )}
                            </div>
                        )}
                    </div>
                </CardHeader>
            </Card>

            <div className="space-y-6">
                {/* Code Versions */}
                <CodeVersionsList
                    challengeId={challenge.id}
                    codeVersions={codeVersions}
                    variant="summary"
                    isTeacher={isTeacher}
                />

                {/* Description */}
                <div>
                    <h4 className="text-xl font-semibold text-muted-foreground mb-4">
                        {dict?.challenges?.messages?.summary?.overview ||
                            "Overview"}
                    </h4>
                    <MdxRenderer serializedSource={serializedMarkdown} />
                </div>
            </div>
        </section>
    );
}
