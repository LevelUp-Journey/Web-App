"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { Button } from "@/components/ui/button";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import type { Challenge } from "@/services/internal/challenges/entities/challenge.entity";
import type { CodeVersion } from "@/services/internal/challenges/entities/code-version.entity";

interface ChallengeSummaryProps {
    challenge: Challenge;
    codeVersions: CodeVersion[];
    renderedMdx: React.ReactNode;
}

export default function ChallengeSummary({
    challenge,
    codeVersions,
    renderedMdx,
}: ChallengeSummaryProps) {
    const router = useRouter();

    const handleEdit = () => {
        router.push(`?editing=true`);
    };

    const handleAddVersion = () => {
        router.push(`/dashboard/challenges/edit/${challenge.id}/versions/add`);
    };

    return (
        <section className="h-screen flex flex-col p-4 container mx-auto">
            {/* Header */}
            <header className="flex-shrink-0 p-6 border-b flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">
                        Challenge Summary
                    </h1>
                    <p className="text-muted-foreground">
                        View the challenge details and description.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button onClick={handleAddVersion}>Add Code Version</Button>
                    <Button onClick={handleEdit}>Edit Challenge</Button>
                </div>
            </header>

            {/* Resizable panels */}
            <div className="flex-1 overflow-hidden">
                <ResizablePanelGroup direction="horizontal" className="h-full">
                    {/* Left Column - Challenge Details and Code Versions */}
                    <ResizablePanel defaultSize={40} minSize={30}>
                        <div className="h-full overflow-y-auto p-6 space-y-6">
                            {/* Challenge Details */}
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
                                    {challenge.tags
                                        .map((tag) => tag.name)
                                        .join(", ")}
                                </div>
                            </div>

                            {/* Code Versions */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">
                                    Code Versions
                                </h2>
                                <div className="space-y-2">
                                    {codeVersions.map((version) => (
                                        <div
                                            key={version.id}
                                            className="flex justify-between items-center p-2 border rounded"
                                        >
                                            <div>
                                                <strong>
                                                    {version.language}
                                                </strong>{" "}
                                                -{" "}
                                                {version.initialCode.substring(
                                                    0,
                                                    50,
                                                )}
                                                ...
                                            </div>
                                            <Button size="sm" variant="outline">
                                                View
                                            </Button>
                                        </div>
                                    ))}
                                    {codeVersions.length === 0 && (
                                        <p className="text-muted-foreground text-sm">
                                            No code versions yet. Click "Add
                                            Code Version" to create one.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    {/* Right Column - Description */}
                    <ResizablePanel defaultSize={60} maxSize={70} minSize={50}>
                        <div className="h-full overflow-y-auto p-6">
                            <h2 className="text-xl font-semibold mb-4">
                                Description
                            </h2>
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                                {renderedMdx}
                            </div>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </section>
    );
}
