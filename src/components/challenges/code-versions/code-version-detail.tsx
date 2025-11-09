"use client";

import { Plus, TestTube } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import MonacoEditor from "@/components/challenges/monaco/monaco-editor";
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
import { useDictionary } from "@/hooks/use-dictionary";
import {
    getReadableLanguageName,
    type ProgrammingLanguage,
} from "@/lib/consts";
import { PATHS } from "@/lib/paths";
import { getMonacoLanguage } from "@/lib/utils";
import { CodeVersionController } from "@/services/internal/challenges/challenge/controller/code-version.controller";
import type { CodeVersion } from "@/services/internal/challenges/challenge/entities/code-version.entity";
import type { VersionTest } from "@/services/internal/challenges/challenge/entities/version-test.entity";

interface CodeVersionDetailProps {
    challengeId: string;
    codeVersion: CodeVersion;
    tests: VersionTest[];
    isEditing?: boolean;
}

export default function CodeVersionDetail({
    challengeId,
    codeVersion,
    tests,
    isEditing = false,
}: CodeVersionDetailProps) {
    const dict = useDictionary();
    const [isEditingMode, setIsEditingMode] = useState(isEditing);
    const [initialCode, setInitialCode] = useState<string>(
        codeVersion.initialCode,
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setInitialCode(codeVersion.initialCode);
    }, [codeVersion]);

    useEffect(() => {
        setIsEditingMode(isEditing);
    }, [isEditing]);

    const handleUpdateCodeVersion = async () => {
        setIsSubmitting(true);
        try {
            await CodeVersionController.updateCodeVersion(
                challengeId,
                codeVersion.id,
                {
                    code: initialCode,
                    functionName: codeVersion.functionName,
                },
            );
            toast.success("Initial code updated successfully");
            setIsEditingMode(false);
        } catch (error) {
            console.error("Error updating initial code:", error);
            toast.error(
                dict?.errors?.updating?.initialCode ||
                    "Failed to update initial code",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelEdit = () => {
        setInitialCode(codeVersion.initialCode);
        setIsEditingMode(false);
    };

    return (
        <section className="h-screen flex flex-col p-4 container mx-auto">
            {/* Header */}
            <header className="shrink-0 p-6 border-b flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">
                        {isEditingMode
                            ? "Edit Initial Code"
                            : "Code Version Summary"}
                    </h1>
                    <p className="text-muted-foreground">
                        {isEditingMode
                            ? "Modify the initial code for this code version."
                            : "View the code version details."}
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
                    {isEditingMode ? (
                        <>
                            <Button
                                onClick={handleUpdateCodeVersion}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Updating..." : "Save Changes"}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleCancelEdit}
                            >
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={() => setIsEditingMode(true)}
                        >
                            Edit Code Version
                        </Button>
                    )}
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
                            {isEditingMode && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full flex items-center justify-center gap-2 text-xs"
                                    asChild
                                >
                                    <Link
                                        href={PATHS.DASHBOARD.CHALLENGES.TESTS.NEW(
                                            challengeId,
                                            codeVersion.id,
                                        )}
                                    >
                                        <Plus className="w-3 h-3" />
                                        Add Test
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Right Panel - Monaco Editor */}
                <ResizablePanel defaultSize={70} minSize={50}>
                    <div className="h-full flex flex-col">
                        <div className="p-4 border-b">
                            <h2 className="text-xl font-semibold">
                                Initial Code
                                {isEditing && (
                                    <>
                                        {" "}
                                        (
                                        {getReadableLanguageName(
                                            codeVersion.language as ProgrammingLanguage,
                                        )}
                                        )
                                    </>
                                )}
                            </h2>
                        </div>
                        <div className="flex-1 p-4">
                            <MonacoEditor
                                language={getMonacoLanguage(
                                    codeVersion.language as ProgrammingLanguage,
                                )}
                                value={
                                    isEditingMode
                                        ? initialCode
                                        : codeVersion.initialCode
                                }
                                onChange={
                                    isEditingMode
                                        ? (value) => setInitialCode(value || "")
                                        : undefined
                                }
                                readOnly={!isEditingMode}
                            />
                        </div>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </section>
    );
}
