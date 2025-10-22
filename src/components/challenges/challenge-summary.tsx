import MdxRenderer from "@/components/challenges/mdx-renderer";
import type { Challenge } from "@/services/internal/challenges/entities/challenge.entity";
import type { CodeVersion } from "@/services/internal/challenges/entities/code-version.entity";
import CodeVersionsList from "./code-versions-list";

interface ChallengeSummaryProps {
    challenge: Challenge;
    codeVersions: CodeVersion[];
    markdownSource: string;
}

export default function ChallengeSummary({
    challenge,
    codeVersions,
    markdownSource,
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
                    />
                </div>

                {/* Description */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Description</h2>
                    <div className="bg-muted p-4 rounded-md">
                        <MdxRenderer source={markdownSource} />
                    </div>
                </div>
            </div>
        </section>
    );
}
