"use client";

import Editor from "@monaco-editor/react";
import { TestTube } from "lucide-react";
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
import { CPlusPlus } from "@/components/ui/svgs/cplusplus";
import { Java } from "@/components/ui/svgs/java";
import { Javascript } from "@/components/ui/svgs/javascript";
import { Python } from "@/components/ui/svgs/python";
import { ProgrammingLanguage } from "@/lib/consts";
import { PATHS } from "@/lib/paths";
import { CodeVersionController } from "@/services/internal/challenges/controller/code-version.controller";
import type { CodeVersion } from "@/services/internal/challenges/entities/code-version.entity";
import type { VersionTest } from "@/services/internal/challenges/entities/version-test.entity";

interface CodeVersionEditingProps {
    challengeId: string;
    initialCodeVersion: CodeVersion;
    tests: VersionTest[];
}

const languages = [
    {
        key: ProgrammingLanguage.JAVASCRIPT,
        name: "JavaScript",
        icon: Javascript,
    },
    { key: ProgrammingLanguage.PYTHON, name: "Python", icon: Python },
    { key: ProgrammingLanguage.JAVA, name: "Java", icon: Java },
    { key: ProgrammingLanguage.C_PLUS_PLUS, name: "C++", icon: CPlusPlus },
];

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
    tests,
}: CodeVersionEditingProps) {
    const router = useRouter();
    const [selectedLanguage, setSelectedLanguage] =
        useState<ProgrammingLanguage>(
            initialCodeVersion.language as ProgrammingLanguage,
        );
    const [initialCode, setInitialCode] = useState<string>(
        initialCodeVersion.initialCode,
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setSelectedLanguage(initialCodeVersion.language as ProgrammingLanguage);
        setInitialCode(initialCodeVersion.initialCode);
    }, [initialCodeVersion]);

    const handleUpdateCodeVersion = async () => {
        setIsSubmitting(true);
        try {
            await CodeVersionController.updateCodeVersion(
                challengeId,
                initialCodeVersion.id,
                {
                    language: selectedLanguage,
                    initialCode,
                },
            );
            toast.success("Code version updated successfully");
            router.push(
                `/dashboard/challenges/edit/${challengeId}/versions/${initialCodeVersion.id}`,
            );
        } catch (error) {
            console.error("Error updating code version:", error);
            toast.error("Failed to update code version");
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
                        Edit Code Version
                    </h1>
                    <p className="text-muted-foreground">
                        Modify the programming language and initial code for
                        this challenge.
                    </p>
                </div>
                <Button
                    onClick={handleUpdateCodeVersion}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Updating..." : "Update Code Version"}
                </Button>
            </header>

            {/* Resizable panels */}
            <ResizablePanelGroup direction="horizontal" className="h-full">
                {/* Left Panel - Language Selection and Tests List */}
                <ResizablePanel defaultSize={30} minSize={25}>
                    <div className="h-full overflow-y-auto p-6 space-y-6">
                        {/* Language Selection */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">
                                Select Language
                            </h2>
                            <div className="space-y-2">
                                {languages.map((lang) => (
                                    <Item
                                        key={lang.key}
                                        variant={
                                            selectedLanguage === lang.key
                                                ? "muted"
                                                : "default"
                                        }
                                        className="cursor-pointer"
                                        onClick={() =>
                                            setSelectedLanguage(lang.key)
                                        }
                                    >
                                        <ItemMedia variant="icon">
                                            <lang.icon className="w-5 h-5" />
                                        </ItemMedia>
                                        <ItemContent>
                                            <ItemTitle>{lang.name}</ItemTitle>
                                            <ItemDescription>
                                                {selectedLanguage === lang.key
                                                    ? "Currently selected"
                                                    : "Click to select this programming language"}
                                            </ItemDescription>
                                        </ItemContent>
                                    </Item>
                                ))}
                            </div>
                        </div>

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
                                        <Button size="sm" variant="outline" asChild>
                                            <Link
                                                href={PATHS.DASHBOARD.CHALLENGES.TESTS.ADD(
                                                    challengeId,
                                                    initialCodeVersion.id,
                                                ) + `?testId=${test.id}`}
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

                {/* Right Panel - Monaco Editor */}
                <ResizablePanel defaultSize={70} minSize={50}>
                    <div className="h-full flex flex-col">
                        <div className="p-4 border-b">
                            <h2 className="text-xl font-semibold">
                                Initial Code{" "}
                                {selectedLanguage &&
                                    `(${languages.find((l) => l.key === selectedLanguage)?.name})`}
                            </h2>
                        </div>
                        <div className="flex-1">
                            <Editor
                                height="100%"
                                language={getMonacoLanguage(selectedLanguage)}
                                value={initialCode}
                                onChange={(value) =>
                                    setInitialCode(value || "")
                                }
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    lineNumbers: "on",
                                    roundedSelection: false,
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                }}
                            />
                        </div>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </section>
    );
}
