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
import type { SerializeResult } from "next-mdx-remote-client/csr";
import { useState } from "react";
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
import { useAutoSave } from "@/hooks/challenges/use-auto-save";
import { useSubmitSolution } from "@/hooks/challenges/use-submit-solution";
import { useDictionary } from "@/hooks/use-dictionary";
import { CONSTS, ProgrammingLanguage } from "@/lib/consts";
import { PATHS } from "@/lib/paths";
import type { Challenge } from "@/services/internal/challenges/challenge/entities/challenge.entity";
import type { CodeVersion } from "@/services/internal/challenges/challenge/entities/code-version.entity";
import type { VersionTest } from "@/services/internal/challenges/challenge/entities/version-test.entity";
import { SolutionsController } from "@/services/internal/challenges/solutions/controller/solutions.controller";
import type { SolutionResponse } from "@/services/internal/challenges/solutions/controller/solutions.response";

interface StudentCodeEditorProps {
    challenge: Challenge;
    codeVersion: CodeVersion;
    tests: VersionTest[];
    serializedDescription: SerializeResult | null;
    solution: SolutionResponse | null;
}

/**
 * Convierte el lenguaje de programación al formato de Monaco Editor
 */
const getMonacoLanguage = (language: ProgrammingLanguage): string => {
    const languageMap: Record<ProgrammingLanguage, string> = {
        [ProgrammingLanguage.JAVASCRIPT]: "javascript",
        [ProgrammingLanguage.PYTHON]: "python",
        [ProgrammingLanguage.JAVA]: "java",
        [ProgrammingLanguage.C_PLUS_PLUS]: "cpp",
    };

    return languageMap[language] || "javascript";
};

/**
 * Componente principal del editor de código para estudiantes
 * Permite editar, guardar automáticamente y ejecutar soluciones de código
 */
export default function StudentCodeEditor({
    challenge,
    codeVersion,
    tests,
    serializedDescription,
    solution,
}: StudentCodeEditorProps) {
    const dict = useDictionary();
    // Estado de la UI
    const [activeTab, setActiveTab] = useState<"description" | "tests">(
        "description",
    );

    // ID de la solución (inmutable)
    const solutionId = solution?.id || null;

    // Hook de auto-guardado con debounce
    const {
        content: code,
        updateContent: setCode,
        saveStatus,
        isManualSaving,
        hasUnsavedChanges,
        saveManually,
    } = useAutoSave({
        initialContent: solution?.code || codeVersion.initialCode,
        onSave: async (codeToSave) => {
            if (!solutionId) {
                throw new Error("No solution ID available");
            }

            await SolutionsController.updateSolution({
                solutionId,
                code: codeToSave,
            });
        },
        delay: CONSTS.SOLUTION_UPDATE_DELAY,
        enabled: !!solutionId,
    });

    // Hook de envío de solución
    const { submit, isSubmitting, submitResult } = useSubmitSolution({
        onSubmit: async () => {
            if (!solutionId) {
                throw new Error("No solution ID available");
            }

            const result = await SolutionsController.submitSolution(solutionId);

            if (!result) {
                throw new Error("Failed to submit solution");
            }

            return result;
        },
        onSuccess: (result) => {
            setActiveTab("tests");
            toast.success(result.message);
        },
        onError: (error) => {
            console.error("Error submitting solution:", error);
            toast.error("Failed to submit solution");
        },
    });

    /**
     * Manejador de guardado manual
     */
    const handleManualSave = async () => {
        try {
            await saveManually();
            toast.success("Code saved successfully!");
        } catch (error) {
            console.error("Error saving code:", error);
            toast.error(dict?.errors?.saving?.code || "Failed to save code");
        }
    };

    /**
     * Manejador de envío de solución
     */
    const handleSubmit = async () => {
        try {
            await submit();
        } catch {
            // El error ya se maneja en el hook
        }
    };

    /**
     * Obtiene el texto del botón de guardado según el estado
     */
    const getSaveButtonText = (): string => {
        if (isManualSaving) return "Saving...";
        if (saveStatus === "saved") return "Saved";
        if (saveStatus === "error") return "Error";
        return "Save";
    };

    /**
     * Obtiene la variante del botón de guardado según el estado
     */
    const getSaveButtonVariant = (): "outline" | "default" | "secondary" => {
        if (saveStatus === "saved") return "secondary";
        if (saveStatus === "error") return "outline";
        return "outline";
    };

    // Estados de deshabilitado de los botones
    const isSaveDisabled = isManualSaving || !hasUnsavedChanges || !solutionId;
    const isSubmitDisabled =
        isSubmitting ||
        isManualSaving ||
        saveStatus === "saving" ||
        !solutionId;

    return (
        <section className="h-screen flex flex-col">
            {/* Header */}
            <header className="shrink-0 p-4 border-b flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link
                        href={PATHS.DASHBOARD.ROOT}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                        aria-label="Back to dashboard"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>

                    <div>
                        <h1 className="text-2xl font-bold">{challenge.name}</h1>
                        <p className="text-sm text-muted-foreground">
                            {challenge.experiencePoints} XP
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Indicador de auto-guardado */}
                    {saveStatus === "saving" && (
                        <span className="text-sm text-muted-foreground animate-pulse">
                            Auto-saving...
                        </span>
                    )}

                    {/* Botón de guardado manual */}
                    <Button
                        onClick={handleManualSave}
                        disabled={isSaveDisabled}
                        variant={getSaveButtonVariant()}
                        size="sm"
                        aria-label="Save code manually"
                    >
                        <Save className="h-4 w-4" />
                        {getSaveButtonText()}
                    </Button>

                    {/* Botón de ejecución */}
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitDisabled}
                        variant="default"
                        size="sm"
                        aria-label="Run code and submit solution"
                    >
                        <Play className="h-4 w-4" />
                        {isSubmitting ? "Executing..." : "Run Code"}
                    </Button>
                </div>
            </header>

            {/* Resizable panels */}
            <ResizablePanelGroup direction="horizontal" className="h-full">
                {/* Left Panel - Monaco Editor */}
                <ResizablePanel defaultSize={70} minSize={50} maxSize={80}>
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
                <ResizablePanel defaultSize={30} minSize={20}>
                    <div className="h-full flex flex-col">
                        <Tabs
                            value={activeTab}
                            onValueChange={(value) =>
                                setActiveTab(value as "description" | "tests")
                            }
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

                            {/* Description Tab */}
                            <TabsContent
                                value="description"
                                className="flex-1 overflow-y-auto p-4 m-0"
                            >
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">
                                            Challenge Description
                                        </h3>
                                        <div className="p-4 rounded-md prose prose-sm dark:prose-invert max-w-none">
                                            {serializedDescription ? (
                                                <MdxRenderer
                                                    serializedSource={
                                                        serializedDescription
                                                    }
                                                />
                                            ) : (
                                                <p className="text-muted-foreground">
                                                    No description available.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Tests Tab */}
                            <TabsContent
                                value="tests"
                                className="flex-1 overflow-y-auto p-4 m-0"
                            >
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">
                                        Test Cases
                                    </h3>

                                    {/* Resultados de envío */}
                                    {submitResult && (
                                        <div
                                            className={`p-4 rounded-lg border ${
                                                submitResult.passedTests ===
                                                submitResult.totalTests
                                                    ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                                                    : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                                            }`}
                                        >
                                            <div className="space-y-2">
                                                <p className="font-medium">
                                                    Submission Results:{" "}
                                                    <span
                                                        className={
                                                            submitResult.passedTests ===
                                                            submitResult.totalTests
                                                                ? "text-green-600 dark:text-green-400"
                                                                : "text-red-600 dark:text-red-400"
                                                        }
                                                    >
                                                        {
                                                            submitResult.passedTests
                                                        }
                                                        /
                                                        {
                                                            submitResult.totalTests
                                                        }{" "}
                                                        tests passed
                                                    </span>
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Time taken:{" "}
                                                    {submitResult.timeTaken}ms
                                                </p>
                                                {submitResult.passedTests ===
                                                submitResult.totalTests ? (
                                                    <p className="text-green-600 dark:text-green-400 font-medium flex items-center gap-2">
                                                        <CheckCircle className="h-5 w-5" />
                                                        All tests passed!
                                                        Congratulations!
                                                    </p>
                                                ) : (
                                                    <p className="text-red-600 dark:text-red-400 font-medium flex items-center gap-2">
                                                        <XCircle className="h-5 w-5" />
                                                        Some tests failed. Keep
                                                        trying!
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Lista de tests */}
                                    {tests.length === 0 ? (
                                        <p className="text-muted-foreground text-sm">
                                            No test cases available.
                                        </p>
                                    ) : (
                                        <div className="space-y-2">
                                            {tests.map((test, index) => {
                                                const isPassed =
                                                    submitResult?.approvedTestIds.includes(
                                                        test.id,
                                                    );

                                                const itemClass = submitResult
                                                    ? isPassed
                                                        ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                                                        : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
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
                                                                {submitResult &&
                                                                    (isPassed ? (
                                                                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                                    ) : (
                                                                        <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                                                    ))}
                                                                {test.isSecret && (
                                                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                                                )}
                                                                <span>
                                                                    Test Case{" "}
                                                                    {index + 1}
                                                                </span>
                                                                {test.isSecret && (
                                                                    <span className="text-xs text-muted-foreground">
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
                                                                    {/* Input */}
                                                                    <div>
                                                                        <p className="text-sm font-medium mb-1">
                                                                            Input:
                                                                        </p>
                                                                        <pre className="bg-muted p-2 rounded text-xs overflow-x-auto font-mono">
                                                                            {
                                                                                test.input
                                                                            }
                                                                        </pre>
                                                                    </div>

                                                                    {/* Expected Output */}
                                                                    {submitResult ? (
                                                                        <div>
                                                                            <p className="text-sm font-medium mb-1">
                                                                                Expected
                                                                                Output:
                                                                            </p>
                                                                            <pre className="bg-muted p-2 rounded text-xs overflow-x-auto font-mono">
                                                                                {
                                                                                    test.expectedOutput
                                                                                }
                                                                            </pre>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                                                            <Lock className="h-3 w-3" />
                                                                            <p>
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
