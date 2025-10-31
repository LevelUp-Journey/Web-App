import { getReadableLanguageName } from "@/lib/consts";
import type { CodeVersion } from "@/services/internal/challenges/challenge/entities/code-version.entity";

interface VersionSummaryProps {
    challengeId: string;
    codeVersions: CodeVersion[];
}

export default function VersionSummary({
    challengeId,
    codeVersions,
}: VersionSummaryProps) {
    const selectedCode =
        codeVersions.length > 0 ? codeVersions[0].initialCode : "";

    return (
        <section className="h-screen flex flex-col p-4 container mx-auto">
            <header className="shrink-0 p-6 border-b">
                <h1 className="text-3xl font-bold mb-2">Code Versions</h1>
                <p className="text-muted-foreground">
                    View and manage code versions for this challenge.
                </p>
            </header>

            <div className="flex-1 overflow-hidden">
                <div className="grid grid-cols-2 h-full">
                    {/* Left Column - List of Code Versions */}
                    <div className="p-6 border-r overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-4">
                            Available Code Versions
                        </h2>
                        {codeVersions.length > 0 ? (
                            <div className="space-y-2">
                                {codeVersions.map((version) => (
                                    <div
                                        key={version.id}
                                        className="p-4 border rounded-lg bg-card"
                                    >
                                        <h3 className="font-medium">
                                            {getReadableLanguageName(
                                                version.language,
                                            )}
                                        </h3>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">
                                No code versions available.
                            </p>
                        )}
                    </div>

                    {/* Right Column - Initial Code */}
                    <div className="p-6 overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-4">
                            Initial Code
                        </h2>
                        {selectedCode ? (
                            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                                <code>{selectedCode}</code>
                            </pre>
                        ) : (
                            <p className="text-muted-foreground">
                                No code version selected.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
