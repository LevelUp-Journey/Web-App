"use client";

import { ArrowLeft, Lock, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import MdxRenderer from "@/components/challenges/mdx-renderer";
import MonacoEditor from "@/components/challenges/monaco/monaco-editor";
import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgrammingLanguage } from "@/lib/consts";
import { PATHS } from "@/lib/paths";
import type { Challenge } from "@/services/internal/challenges/challenge/entities/challenge.entity";
import type { CodeVersion } from "@/services/internal/challenges/challenge/entities/code-version.entity";
import type { VersionTest } from "@/services/internal/challenges/challenge/entities/version-test.entity";
import type { SolutionResponse } from "@/services/internal/challenges/solutions/controller/solutions.response";
import { SolutionsController } from "@/services/internal/challenges/solutions/controller/solutions.controller";

interface StudentCodeEditorProps {
    challenge: Challenge;
    codeVersion: CodeVersion;
    tests: VersionTest[];
    serializedDescription: any;
    solution: SolutionResponse | null;
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

export default function StudentCodeEditor({
    challenge,
    codeVersion,
    tests,
    serializedDescription,
    solution,
}: StudentCodeEditorProps) {
    const [code, setCode] = useState<string>(
        solution?.code || codeVersion.initialCode,
    );
    const [solutionId, setSolutionId] = useState<string | null>(
        solution?.id || null,
    );
    const [isSaving, setIsSaving] = useState(false);
    const [isRunning, setIsRunning] = useState(false);

    // Auto-save with debounce of 3 seconds
    useEffect(() => {
        const timer = setTimeout(async () => {
            // Skip if code hasn't changed
            if (code === (solution?.code || codeVersion.initialCode)) {
                return;
            }

            setIsSaving(true);
            try {
                await SolutionsController.updateSolution({
                    solutionId: solutionId as string,
                    code: code,
                });

                toast.success("Code saved successfully!");
            } catch (error) {
                console.error("Error saving code:", error);
                toast.error("Failed to save code");
            } finally {
                setIsSaving(false);
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [code, solutionId, solution?.code, codeVersion.initialCode]);

    const handleRunCode = async () => {
        setIsRunning(true);
        try {
            // TODO: Implement code execution logic
            toast.success("Code executed successfully!");
        } catch (error) {
            console.error("Error running code:", error);
            toast.error("Failed to run code");
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <section className="h-screen flex flex-col">
            {/* Header */}
            <header className="shrink-0 p-4 border-b flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link
                        href={PATHS.DASHBOARD.ROOT}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                        <ArrowLeft />
                    </Link>

                    <div>
                        <h1 className="text-2xl font-bold">{challenge.name}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {isSaving && (
                        <span className="text-sm text-muted-foreground">
                            Saving...
                        </span>
                    )}
                    <Button
                        onClick={handleRunCode}
                        disabled={isRunning}
                        variant="default"
                    >
                        <Play className="h-4 w-4 mr-2" />
                        {isRunning ? "Running..." : "Run Code"}
                    </Button>
                </div>
            </header>

            {/* Resizable panels */}
            <ResizablePanelGroup direction="horizontal" className="h-full">
                {/* Left Panel - Monaco Editor */}
                <ResizablePanel defaultSize={70} minSize={50} maxSize={70}>
                    <div className="h-full flex flex-col">
                        <div className="flex-1 overflow-hidden p-4">
                            <MonacoEditor
                                language={getMonacoLanguage(
                                    codeVersion.language as ProgrammingLanguage,
                                )}
                                value={code}
                                onChange={(value) => setCode(value || "")}
                            />
                        </div>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Right Panel - Tabs for Description and Tests */}
                <ResizablePanel defaultSize={30} minSize={30}>
                    <div className="h-full flex flex-col">
                        <Tabs
                            defaultValue="description"
                            className="h-full flex flex-col"
                        >
                            <TabsList className="m-4">
                                <TabsTrigger value="description">
                                    Description
                                </TabsTrigger>
                                <TabsTrigger value="tests">
                                    Test Cases ({tests.length})
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent
                                value="description"
                                className="flex-1 overflow-y-auto p-4 m-0"
                            >
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">
                                            Challenge Description
                                        </h3>
                                        <div className="bg-muted p-4 rounded-md">
                                            <MdxRenderer
                                                serializedSource={
                                                    serializedDescription
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <h3 className="text-lg font-semibold mb-2">
                                            Details
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <div>
                                                <strong>
                                                    Experience Points:
                                                </strong>{" "}
                                                {challenge.experiencePoints}
                                            </div>
                                            <div>
                                                <strong>Function Name:</strong>{" "}
                                                {codeVersion.functionName ||
                                                    "N/A"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent
                                value="tests"
                                className="flex-1 overflow-y-auto p-4 m-0"
                            >
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">
                                        Test Cases
                                    </h3>
                                    {tests.length === 0 ? (
                                        <p className="text-muted-foreground text-sm">
                                            No test cases available.
                                        </p>
                                    ) : (
                                        <div className="space-y-2">
                                            {tests.map((test, index) => (
                                                <Item
                                                    key={test.id}
                                                    variant="muted"
                                                    size="sm"
                                                >
                                                    <ItemContent>
                                                        <ItemTitle className="flex items-center gap-2">
                                                            {test.isSecret && (
                                                                <Lock className="h-4 w-4 text-muted-foreground" />
                                                            )}
                                                            Test Case{" "}
                                                            {index + 1}
                                                            {test.isSecret && (
                                                                <span className="text-sm text-muted-foreground">
                                                                    (Secret)
                                                                </span>
                                                            )}
                                                        </ItemTitle>
                                                        {test.isSecret ? (
                                                            <div className="text-sm text-muted-foreground mt-2">
                                                                This is a secret
                                                                test used to
                                                                validate your
                                                                solution. Input
                                                                and expected
                                                                output are
                                                                hidden.
                                                            </div>
                                                        ) : (
                                                            <div className="mt-2 space-y-2">
                                                                <div>
                                                                    <p className="text-sm font-medium">
                                                                        Input:
                                                                    </p>
                                                                    <pre className="bg-muted p-2 rounded text-xs overflow-x-auto mt-1">
                                                                        {
                                                                            test.input
                                                                        }
                                                                    </pre>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-muted-foreground">
                                                                        Expected
                                                                        output
                                                                        is
                                                                        hidden
                                                                        until
                                                                        you run
                                                                        your
                                                                        code
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </ItemContent>
                                                </Item>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </section>
    );
}
