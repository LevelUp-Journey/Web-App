import { useDictionary } from "@/hooks/use-dictionary";
import { getReadableLanguageName } from "@/lib/consts";
import { Card, CardContent } from "@/components/ui/card";
import type { CodeVersion } from "@/services/internal/challenges/challenge/entities/code-version.entity";

interface VersionSummaryProps {
    challengeId: string;
    codeVersions: CodeVersion[];
}

export default function VersionSummary({
    challengeId,
    codeVersions,
}: VersionSummaryProps) {
    const dict = useDictionary();
    const selectedCode =
        codeVersions.length > 0 ? codeVersions[0].initialCode : "";

    return (
        <section className="h-screen flex flex-col p-4 container mx-auto">
            <header className="shrink-0 p-6 border-b">
                <h1 className="text-3xl font-bold mb-2">
                    {dict?.challenges?.codeVersions?.codeVersionsTitle ||
                        "Code Versions"}
                </h1>
                <p className="text-muted-foreground">
                    {dict?.challenges?.codeVersions?.codeVersionsDescription ||
                        "View and manage code versions for this challenge."}
                </p>
            </header>

            <div className="flex-1 overflow-hidden">
                <div className="grid grid-cols-2 h-full">
                    {/* Left Column - List of Code Versions */}
                    <div className="p-6 border-r overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-4">
                            {dict?.challenges?.codeVersions
                                ?.availableCodeVersions ||
                                "Available Code Versions"}
                        </h2>
                        {codeVersions.length > 0 ? (
                            <div className="space-y-2">
                                {codeVersions.map((version) => (
                                    <Card key={version.id}>
                                        <CardContent className="p-4">
                                            <h3 className="font-medium">
                                                {getReadableLanguageName(
                                                    version.language,
                                                )}
                                            </h3>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">
                                {dict?.challenges?.codeVersions
                                    ?.noCodeVersionsAvailable ||
                                    "No code versions available."}
                            </p>
                        )}
                    </div>

                    {/* Right Column - Initial Code */}
                    <div className="p-6 overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-4">
                            {dict?.challenges?.codeVersions?.initialCode ||
                                "Initial Code"}
                        </h2>
                        {selectedCode ? (
                            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                                <code>{selectedCode}</code>
                            </pre>
                        ) : (
                            <p className="text-muted-foreground">
                                {dict?.challenges?.codeVersions
                                    ?.noCodeVersionSelected ||
                                    "No code version selected."}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
