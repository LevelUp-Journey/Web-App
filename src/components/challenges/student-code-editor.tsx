"use client";

import {
    ArrowLeft,
    CheckCircle,
    Lock,
    Play,
    Save,
    XCircle,
} from "lucide-react";
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
import { CONSTS, ProgrammingLanguage } from "@/lib/consts";
import { PATHS } from "@/lib/paths";
import type { Challenge } from "@/services/internal/challenges/challenge/entities/challenge.entity";
import type { CodeVersion } from "@/services/internal/challenges/challenge/entities/code-version.entity";
import type { VersionTest } from "@/services/internal/challenges/challenge/entities/version-test.entity";
import { SolutionsController } from "@/services/internal/challenges/solutions/controller/solutions.controller";
import type {
    SolutionResponse,
    SubmitSolutionResponse,
} from "@/services/internal/challenges/solutions/controller/solutions.response";

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isManualSaving, setIsManualSaving] = useState(false);
    const [savingDots, setSavingDots] = useState("");
    const [submitResults, setSubmitResults] =
        useState<SubmitSolutionResponse | null>(null);

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
        }, CONSTS.SOLUTION_UPDATE_DELAY);

        return () => clearTimeout(timer);
    }, [code, solutionId, solution?.code, codeVersion.initialCode]);

    useEffect(() => {
        if (!isManualSaving) return;
        const interval = setInterval(() => {
            setSavingDots((prev) => (prev.length < 3 ? prev + "." : ""));
        }, 500);
        return () => clearInterval(interval);
    }, [isManualSaving]);

    const handleSave = async () => {
        setIsManualSaving(true);
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
            setIsManualSaving(false);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const response = (await SolutionsController.submitSolution(
                solutionId as string,
            )) as SubmitSolutionResponse;

            setSubmitResults(response);
            toast.success(response.message);
        } catch (error) {
            console.error("Error submitting solution:", error);
            toast.error("Failed to submit solution");
        } finally {
            setIsSubmitting(false);
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
                        onClick={handleSave}
                        disabled={isManualSaving}
                        variant="outline"
                        size={"sm"}
                    >
                        <Save />
                        {isManualSaving ? `Saving${savingDots}` : "Save"}
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || isManualSaving}
                        variant="default"
                        size={"sm"}
                    >
                        <Play />
                        {isSubmitting ? "Executing..." : "Run Code"}
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
                                    {submitResults && (
                                        <div
                                            className={`p-4 rounded ${submitResults.passedTests === submitResults.totalTests ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                                        >
                                            <p className="font-medium">
                                                Submission Results:{" "}
                                                {submitResults.passedTests}/
                                                {submitResults.totalTests} tests
                                                passed
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Time taken:{" "}
                                                {submitResults.timeTaken}ms
                                            </p>
                                            {submitResults.passedTests ===
                                            submitResults.totalTests ? (
                                                <p className="text-green-600 font-medium">
                                                    All tests passed!
                                                </p>
                                            ) : (
                                                <p className="text-red-600 font-medium">
                                                    Some tests failed.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                    {tests.length === 0 ? (
                                        <p className="text-muted-foreground text-sm">
                                            No test cases available.
                                        </p>
                                    ) : (
                                        <div className="space-y-2">
                                            {tests.map((test, index) => {
                                                const isPassed =
                                                    submitResults?.approvedTestIds.includes(
                                                        test.id,
                                                    );
                                                const itemClass = submitResults
                                                    ? isPassed
                                                        ? "bg-green-50 border-green-200"
                                                        : "bg-red-50 border-red-200"
                                                    : "";
                                                return (
                                                    <Item
                                                        key={test.id}
                                                        variant="muted"
                                                        size="sm"
                                                        className={itemClass}
                                                    >
                                                        <ItemContent>
                                                            <ItemTitle className="flex items-center gap-2">
                                                                {submitResults &&
                                                                    (isPassed ? (
                                                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                                                    ) : (
                                                                        <XCircle className="h-4 w-4 text-red-600" />
                                                                    ))}
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
                                                                    This is a
                                                                    secret test
                                                                    used to
                                                                    validate
                                                                    your
                                                                    solution.
                                                                    Input and
                                                                    expected
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
                                                                    {submitResults ? (
                                                                        <div>
                                                                            <p className="text-sm font-medium">
                                                                                Expected
                                                                                Output:
                                                                            </p>
                                                                            <pre className="bg-muted p-2 rounded text-xs overflow-x-auto mt-1">
                                                                                {
                                                                                    test.expectedOutput
                                                                                }
                                                                            </pre>
                                                                        </div>
                                                                    ) : (
                                                                        <div>
                                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                                Expected
                                                                                output
                                                                                is
                                                                                hidden
                                                                                until
                                                                                you
                                                                                submit
                                                                                your
                                                                                solution
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </ItemContent>
                                                    </Item>
                                                );
                                            })}
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
