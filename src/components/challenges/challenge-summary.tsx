"use client";

import Link from "next/link";
import type { SerializeResult } from "next-mdx-remote-client/csr";
import CodeVersionsList from "@/components/challenges/code-versions-list";
import MdxRenderer from "@/components/challenges/mdx-renderer";
import PublishButton from "@/components/challenges/publish-button";
import { Button } from "@/components/ui/button";
import { ChallengeStatus } from "@/lib/consts";
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
    return (
        <section className="h-screen flex flex-col p-4 w-full max-w-4xl mx-auto">
            {/* Header */}
            <header className="shrink-0 p-6 border-b flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">
                        Challenge Summary
                    </h1>
                    <p className="text-muted-foreground">
                        View the challenge details and description.
                    </p>
                </div>
                <div className="flex gap-2">
                    {isTeacher &&
                        challenge.status !== ChallengeStatus.PUBLISHED && (
                            <PublishButton challengeId={challenge.id} />
                        )}
                    {isTeacher && (
                        <Link href="?editing=true">
                            <Button variant="outline">Edit</Button>
                        </Link>
                    )}
                </div>
            </header>

            {/* Vertical Layout */}
            <div className="flex-1 overflow-y-auto space-y-6 p-6">
                {/* Challenge Details */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Challenge Details</h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <strong>Title:</strong> {challenge.name}
                        </div>
                        <div>
                            <strong>Status:</strong> {challenge.status}
                        </div>
                        <div>
                            <strong>Experience Points:</strong>{" "}
                            {challenge.experiencePoints}
                        </div>
                        <div>
                            <strong>Tags:</strong>{" "}
                            {challenge.tags.map((tag) => tag.name).join(", ")}
                        </div>
                    </div>
                </div>

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
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Description</h2>
                    <div className="bg-muted p-4 rounded-md">
                        <MdxRenderer serializedSource={serializedMarkdown} />
                    </div>
                </div>
            </div>
        </section>
    );
}
