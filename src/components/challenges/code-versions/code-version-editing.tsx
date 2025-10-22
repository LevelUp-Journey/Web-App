"use client";

import { Plus, TestTube } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";

import { getReadableLanguageName, ProgrammingLanguage } from "@/lib/consts";
import { PATHS } from "@/lib/paths";
import { CodeVersionController } from "@/services/internal/challenges/controller/code-version.controller";
import type { CodeVersion } from "@/services/internal/challenges/entities/code-version.entity";
import type { VersionTest } from "@/services/internal/challenges/entities/version-test.entity";
import MonacoEditor from "../monaco/monaco-editor";

interface CodeVersionEditingProps {
    challengeId: string;
    initialCodeVersion: CodeVersion;
    initialTests: VersionTest[];
}

const getMonacoLanguage = (language: ProgrammingLanguage): string => {
    switch (language) {
        case ProgrammingLanguage.JAVASCRIPT:
            return "javascript";
        case ProgrammingLanguage.PYTHON:
            return "python";
        case ProgrammingLanguage.JAVA:
            return "java";
        case ProgrammingLanguage.C_PLUS_PLUS:
            return "cpp";
        default:
            return "javascript";
    }
};

export default function CodeVersionEditing({
    challengeId,
    initialCodeVersion,
    initialTests,
}: CodeVersionEditingProps) {
    const router = useRouter();
    const [initialCode, setInitialCode] = useState<string>(
        initialCodeVersion.initialCode,
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setInitialCode(initialCodeVersion.initialCode);
    }, [initialCodeVersion]);

    const handleUpdateCodeVersion = async () => {
        setIsSubmitting(true);
        try {
            await CodeVersionController.updateCodeVersion(
                challengeId,
                initialCodeVersion.id,
                {
                    code: initialCode,
                    functionName: initialCodeVersion.functionName,
                },
            );
            toast.success("Initial code updated successfully");
            router.push(
                PATHS.DASHBOARD.CHALLENGES.VERSIONS.VIEW(
                    challengeId,
                    initialCodeVersion.id,
                ),
            );
        } catch (error) {
            console.error("Error updating initial code:", error);
            toast.error("Failed to update initial code");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="h-screen flex flex-col p-4 container mx-auto">
            {/* Header */}
            <header className="shrink-0 p-6 border-b flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">
                        Edit Initial Code
                    </h1>
                    <p className="text-muted-foreground">
                        Modify the initial code for this code version.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button asChild>
                        <Link
                            href={PATHS.DASHBOARD.CHALLENGES.TESTS.LIST(
                                challengeId,
                                initialCodeVersion.id,
                            )}
                        >
                            Manage Tests
                        </Link>
                    </Button>
                    <Button
                        onClick={handleUpdateCodeVersion}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Updating..." : "Save Changes"}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() =>
                            router.push(
                                PATHS.DASHBOARD.CHALLENGES.VERSIONS.VIEW(
                                    challengeId,
                                    initialCodeVersion.id,
                                ),
                            )
                        }
                    >
                        Back to Summary
                    </Button>
                </div>
            </header>

            {/* Resizable panels */}
            <ResizablePanelGroup direction="horizontal" className="h-full">
                {/* Left Panel - Language and Tests List */}
                <ResizablePanel defaultSize={30} minSize={25}>
                    <div className="h-full overflow-y-auto p-6 space-y-6">
                        {/* Tests List */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">
                                Tests ({initialTests.length})
                            </h2>
                            <div className="space-y-2">
                                {initialTests.map((test) => (
                                    <Item key={test.id} variant="default">
                                        <ItemMedia variant="icon">
                                            <TestTube className="w-5 h-5" />
                                        </ItemMedia>
                                        <ItemContent>
                                            <ItemTitle>
                                                Test Case {test.id.slice(-8)}
                                            </ItemTitle>
                                            <ItemDescription>
                                                Input:{" "}
                                                {test.input.length > 20
                                                    ? `${test.input.slice(0, 20)}...`
                                                    : test.input}
                                            </ItemDescription>
                                        </ItemContent>
                                        <Button
                                            size="default"
                                            variant="outline"
                                            asChild
                                        >
                                            <Link
                                                href={PATHS.DASHBOARD.CHALLENGES.TESTS.VIEW(
                                                    challengeId,
                                                    initialCodeVersion.id,
                                                    test.id,
                                                )}
                                            >
                                                View
                                            </Link>
                                        </Button>
                                    </Item>
                                ))}
                                {initialTests.length === 0 && (
                                    <p className="text-muted-foreground text-sm">
                                        No tests yet.
                                    </p>
                                )}
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2 text-xs"
                                asChild
                            >
                                <Link
                                    href={PATHS.DASHBOARD.CHALLENGES.TESTS.NEW(
                                        challengeId,
                                        initialCodeVersion.id,
                                    )}
                                >
                                    <Plus className="w-3 h-3" />
                                    Add Test
                                </Link>
                            </Button>
                        </div>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Right Panel - Monaco Editor */}
                <ResizablePanel defaultSize={70} minSize={50}>
                    <div className="h-full flex flex-col">
                        <div className="p-4 border-b">
                            <h2 className="text-xl font-semibold">
                                Initial Code (
                                {getReadableLanguageName(
                                    initialCodeVersion.language as ProgrammingLanguage,
                                )}
                                )
                            </h2>
                        </div>
                        <div className="flex-1 p-4">
                            <MonacoEditor
                                language={getMonacoLanguage(
                                    initialCodeVersion.language as ProgrammingLanguage,
                                )}
                                value={initialCode}
                                onChange={(value) =>
                                    setInitialCode(value || "")
                                }
                            />
                        </div>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </section>
    );
}
