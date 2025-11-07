"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { SerializeResult } from "next-mdx-remote-client/csr";
import ChallengeDifficultyBadge from "@/components/cards/challenge-difficulty-badge";
import FullLanguageBadge from "@/components/cards/full-language-badge";
import CodeVersionsList from "@/components/challenges/code-versions-list";
import MdxRenderer from "@/components/challenges/mdx-renderer";
import PublishButton from "@/components/challenges/publish-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChallengeDifficulty, ChallengeStatus, type ProgrammingLanguage } from "@/lib/consts";
import type { Challenge } from "@/services/internal/challenges/challenge/entities/challenge.entity";
import type { CodeVersion } from "@/services/internal/challenges/challenge/entities/code-version.entity";
import { SolutionsController } from "@/services/internal/challenges/solutions/controller/solutions.controller";

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
    const router = useRouter();
    const [isStarting, setIsStarting] = useState(false);

    const handleStartChallenge = async () => {
        if (codeVersions.length === 0) return;

        setIsStarting(true);
        try {
            await SolutionsController.createSolution({
                challengeId: challenge.id,
                codeVersionId: codeVersions[0].id, // Start with the first available code version
            });
            router.push(
                `/editor/challenges/${challenge.id}/version/${codeVersions[0].id}`,
            );
        } catch (error) {
            console.error("Error starting challenge:", error);
            toast.error("Failed to start challenge");
        } finally {
            setIsStarting(false);
        }
    };
    return (
        <section className="flex flex-col p-4 w-full max-w-4xl mx-auto">
            {/* Header Card */}
            <Card className="shrink-0 mb-6">
                <CardHeader className="pb-4">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <ChallengeDifficultyBadge
                            difficulty={challenge.difficulty ?? ChallengeDifficulty.EASY}
                        />
                        {codeVersions.map((version) => (
                            <FullLanguageBadge
                                key={version.id}
                                language={version.language as ProgrammingLanguage}
                            />
                        ))}
                    </div>

                    {/* Title and Status */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            <CardTitle className="text-3xl font-bold mb-2">
                                {challenge.name}
                            </CardTitle>
                            {isTeacher && (
                                <div className="text-sm text-muted-foreground">
                                    <strong>Status:</strong> {challenge.status}
                                </div>
                            )}
                        </div>

                        {/* Teacher Action Buttons */}
                        <div className="flex gap-2 items-center ml-4">
                            {isTeacher &&
                                challenge.status !== ChallengeStatus.PUBLISHED && (
                                    <PublishButton challengeId={challenge.id} />
                                )}
                            {isTeacher && (
                                <div className="text-sm text-muted-foreground mr-2">
                                    <strong>XP:</strong> {challenge.experiencePoints}
                                </div>
                            )}
                            {isTeacher && (
                                <Link href="?editing=true">
                                    <Button variant="outline">Edit</Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Start Challenge Button */}
                    {!isTeacher && codeVersions.length > 0 && (
                        <div className="flex justify-start">
                            <Button
                                onClick={handleStartChallenge}
                                disabled={isStarting}
                                size="lg"
                            >
                                <ChevronRight className="h-4 w-4 mr-2" />
                                {isStarting ? "Starting..." : "Start Challenge"}
                            </Button>
                        </div>
                    )}
                </CardHeader>
            </Card>

            {/* Vertical Layout */}
            <div className="space-y-6">
                {/* Code Versions */}
                <div className="space-y-4">
                    <CodeVersionsList
                        challengeId={challenge.id}
                        codeVersions={codeVersions}
                        variant="summary"
                        isTeacher={isTeacher}
                    />
                </div>

                {/* Description */}
                <div>
                    <h4 className="text-xl font-semibold text-muted-foreground mb-4">Overview</h4>
                    <MdxRenderer serializedSource={serializedMarkdown} />
                </div>
            </div>
        </section>
    );
}
