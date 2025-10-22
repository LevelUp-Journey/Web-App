"use client";

import Editor from "@monaco-editor/react";
import { TestTube } from "lucide-react";
import Link from "next/link";
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
import type { CodeVersion } from "@/services/internal/challenges/entities/code-version.entity";
import type { VersionTest } from "@/services/internal/challenges/entities/version-test.entity";
import MonacoEditor from "../monaco/monaco-editor";

interface CodeVersionSummaryProps {
    challengeId: string;
    codeVersion: CodeVersion;
    tests: VersionTest[];
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

export default function CodeVersionSummary({
    challengeId,
    codeVersion,
    tests,
}: CodeVersionSummaryProps) {
    return (
        <section className="h-screen flex flex-col p-4 container mx-auto">
            {/* Header */}
            <header className="shrink-0 p-6 border-b flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">
                        Code Version Summary
                    </h1>
                    <p className="text-muted-foreground">
                        View the code version details.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button asChild>
                        <Link
                            href={PATHS.DASHBOARD.CHALLENGES.TESTS.LIST(
                                challengeId,
                                codeVersion.id,
                            )}
                        >
                            Manage Tests
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link
                            href={PATHS.DASHBOARD.CHALLENGES.VERSIONS.EDIT(
                                challengeId,
                                codeVersion.id,
                            )}
                        >
                            Edit Code Version
                        </Link>
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
                                Tests ({tests.length})
                            </h2>
                            <div className="space-y-2">
                                {tests.map((test) => (
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
                                                    codeVersion.id,
                                                    test.id,
                                                )}
                                            >
                                                View
                                            </Link>
                                        </Button>
                                    </Item>
                                ))}
                                {tests.length === 0 && (
                                    <p className="text-muted-foreground text-sm">
                                        No tests yet.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Right Panel - Initial Code */}
                <ResizablePanel defaultSize={70} minSize={50}>
                    <div className="h-full flex flex-col">
                        <div className="p-4 border-b">
                            <h2 className="text-xl font-semibold">
                                Initial Code
                            </h2>
                        </div>
                        <div className="flex-1">
                            <MonacoEditor
                                language={getMonacoLanguage(
                                    codeVersion.language as ProgrammingLanguage,
                                )}
                                value={codeVersion.initialCode}
                            />
                        </div>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </section>
    );
}
