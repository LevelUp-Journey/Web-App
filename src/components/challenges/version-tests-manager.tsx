"use client";

import Editor from "@monaco-editor/react";
import { Plus, TestTube } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgrammingLanguage } from "@/lib/consts";
import { PATHS } from "@/lib/paths";
import { VersionTestController } from "@/services/internal/challenges/challenge/controller/versions-test.controller";
import type { VersionTest } from "@/services/internal/challenges/challenge/entities/version-test.entity";
import MonacoEditor from "./monaco/monaco-editor";

interface VersionTestsManagerProps {
    challengeId: string;
    codeVersionId: string;
    language: ProgrammingLanguage;
    defaultTestId?: string;
    isEditing?: boolean;
}

const getCustomValidationTemplate = (
    language: ProgrammingLanguage,
    testId: string,
): string => {
    const templates = {
        [ProgrammingLanguage.JAVASCRIPT]: `// Test Case ${testId}
describe("Test Case ${testId}", () => {
    test("should pass", () => {
        // Your custom validation logic here
        expect(true).toBe(true);
    });
});`,
        [ProgrammingLanguage.PYTHON]: `# Test Case ${testId}
import unittest

class TestCase${testId}(unittest.TestCase):
    def test_case(self):
        # Your custom validation logic here
        self.assertTrue(True)

if __name__ == '__main__':
    unittest.main()`,
        [ProgrammingLanguage.JAVA]: `// Test Case ${testId}
import org.junit.Test;
import static org.junit.Assert.*;

public class TestCase${testId} {
    @Test
    public void testCase() {
        // Your custom validation logic here
        assertTrue(true);
    }
}`,
        [ProgrammingLanguage.C_PLUS_PLUS]: `// Test Case ${testId}
#define DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN
#include "doctest.h"

TEST_CASE("Test Case ${testId}") {
    // Your custom validation logic here
    CHECK(true == true);
}`,
    };

    return templates[language] || "// Custom validation code";
};

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

export default function VersionTestsManager({
    challengeId,
    codeVersionId,
    language,
    defaultTestId,
    isEditing = false,
}: VersionTestsManagerProps) {
    const router = useRouter();
    const [tests, setTests] = useState<VersionTest[]>([]);
    const [selectedTest, setSelectedTest] = useState<VersionTest | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [input, setInput] = useState("");
    const [expectedOutput, setExpectedOutput] = useState("");
    const [failureMessage, setFailureMessage] = useState("");
    const [customValidationCode, setCustomValidationCode] = useState("");
    const [isSecret, setIsSecret] = useState(true);

    useEffect(() => {
        loadTests();
    }, []);

    useEffect(() => {
        if (defaultTestId && tests.length > 0) {
            const test = tests.find((t) => t.id === defaultTestId);
            if (test) {
                handleSelectTest(test);
            }
        }
    }, [tests, defaultTestId]);

    const loadTests = async () => {
        try {
            const loadedTests =
                await VersionTestController.getVersionTestsByChallengeIdAndCodeVersionId(
                    challengeId,
                    codeVersionId,
                );
            setTests(loadedTests);
        } catch (error) {
            console.error("Error loading tests:", error);
            toast.error("Failed to load tests");
        }
    };

    const handleCreateTest = () => {
        setIsCreating(true);
        setSelectedTest(null);
        setInput("");
        setExpectedOutput("");
        setFailureMessage("");
        setCustomValidationCode(
            getCustomValidationTemplate(language, `test_${Date.now()}`),
        );
        setIsSecret(true);
    };

    const handleSelectTest = (test: VersionTest) => {
        setIsCreating(false);
        setSelectedTest(test);
        setInput(test.input);
        setExpectedOutput(test.expectedOutput);
        setFailureMessage(test.failureMessage);
        setCustomValidationCode(test.customValidationCode);
        setIsSecret(test.isSecret);
    };

    const handleSubmit = async () => {
        if (!input.trim() || !expectedOutput.trim()) {
            toast.error("Input and expected output are required");
            return;
        }

        setIsSubmitting(true);
        try {
            if (isCreating) {
                await VersionTestController.createVersionTest(
                    challengeId,
                    codeVersionId,
                    {
                        codeVersionId,
                        input: input.trim(),
                        expectedOutput: expectedOutput.trim(),
                        customValidationCode: customValidationCode.trim(),
                        failureMessage: failureMessage.trim(),
                        isSecret,
                    },
                );
                toast.success("Test created successfully");
            } else if (selectedTest) {
                await VersionTestController.updateVersionTest(
                    challengeId,
                    codeVersionId,
                    selectedTest.id,
                    {
                        input: input.trim(),
                        expectedOutput: expectedOutput.trim(),
                        customValidationCode: customValidationCode.trim(),
                        failureMessage: failureMessage.trim(),
                        isSecret,
                    },
                );
                toast.success("Test updated successfully");
            }

            await loadTests();
            if (isCreating) {
                handleCreateTest(); // Reset form for next test
            }
        } catch (error) {
            console.error("Error saving test:", error);
            toast.error("Failed to save test");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteTest = async (testId: string) => {
        if (!confirm("Are you sure you want to delete this test?")) return;

        try {
            await VersionTestController.deleteVersionTest(
                challengeId,
                codeVersionId,
                testId,
            );
            toast.success("Test deleted successfully");
            await loadTests();
            if (selectedTest?.id === testId) {
                setSelectedTest(null);
                setInput("");
                setExpectedOutput("");
                setFailureMessage("");
                setCustomValidationCode("");
                setIsSecret(true);
            }
        } catch (error) {
            console.error("Error deleting test:", error);
            toast.error("Failed to delete test");
        }
    };

    return (
        <section className="h-screen flex flex-col p-4 container mx-auto">
            {/* Header */}
            <header className="shrink-0 p-6 border-b flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Version Tests</h1>
                    <p className="text-muted-foreground">
                        Manage test cases for this code version
                    </p>
                </div>
                <div className="flex gap-4">
                    {isEditing && (
                        <Button
                            onClick={() =>
                                router.push(
                                    PATHS.DASHBOARD.CHALLENGES.VIEW(
                                        challengeId,
                                    ) + "?editing=true",
                                )
                            }
                        >
                            Finish
                        </Button>
                    )}
                    <Button
                        onClick={() =>
                            router.push(
                                PATHS.DASHBOARD.CHALLENGES.VERSIONS.VIEW(
                                    challengeId,
                                    codeVersionId,
                                ),
                            )
                        }
                    >
                        Back to Version
                    </Button>
                </div>
            </header>

            {/* Resizable panels */}
            <ResizablePanelGroup direction="horizontal" className="h-full">
                {/* Left Panel - Tests List */}
                <ResizablePanel defaultSize={30} minSize={25}>
                    <div className="h-full overflow-y-auto p-6">
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold">
                                Test Cases ({tests.length})
                            </h2>
                        </div>

                        <div className="space-y-2">
                            {tests.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <TestTube className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No tests yet</p>
                                    <p className="text-sm">
                                        Click "Add Test" to create your first
                                        test case
                                    </p>
                                </div>
                            ) : (
                                tests.map((test) => (
                                    <Item
                                        key={test.id}
                                        variant={
                                            selectedTest?.id === test.id
                                                ? "muted"
                                                : "default"
                                        }
                                        className="cursor-pointer"
                                        onClick={() => handleSelectTest(test)}
                                    >
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
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteTest(test.id);
                                            }}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            Delete
                                        </Button>
                                    </Item>
                                ))
                            )}
                        </div>
                        <div className="mt-4">
                            <Button
                                onClick={handleCreateTest}
                                size="sm"
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2 text-xs"
                            >
                                <Plus className="w-3 h-3" />
                                Add Test
                            </Button>
                        </div>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Right Panel - Test Form */}
                <ResizablePanel defaultSize={70} minSize={50}>
                    <div className="h-full flex flex-col">
                        <div className="p-4 border-b">
                            <h2 className="text-xl font-semibold">
                                {isCreating
                                    ? "Create New Test"
                                    : selectedTest
                                      ? `Edit Test Case ${selectedTest.id.slice(-8)}`
                                      : "Select a test to edit"}
                            </h2>
                        </div>

                        {(isCreating || selectedTest) && (
                            <div className="flex-1 overflow-y-auto">
                                <Tabs defaultValue="basic" className="h-full">
                                    <TabsList className="grid grid-cols-2 m-4">
                                        <TabsTrigger value="basic">
                                            Basic Test
                                        </TabsTrigger>
                                        <TabsTrigger value="custom">
                                            Custom Validation
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent
                                        value="basic"
                                        className="p-4 space-y-4"
                                    >
                                        <div className="space-y-2">
                                            <Label htmlFor="input">Input</Label>
                                            <Input
                                                id="input"
                                                placeholder="Enter test input..."
                                                value={input}
                                                onChange={(e) =>
                                                    setInput(e.target.value)
                                                }
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="expectedOutput">
                                                Expected Output
                                            </Label>
                                            <Input
                                                id="expectedOutput"
                                                placeholder="Enter expected output..."
                                                value={expectedOutput}
                                                onChange={(e) =>
                                                    setExpectedOutput(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="failureMessage">
                                                Failure Message (Optional)
                                            </Label>
                                            <Input
                                                id="failureMessage"
                                                placeholder="Custom failure message..."
                                                value={failureMessage}
                                                onChange={(e) =>
                                                    setFailureMessage(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    id="isSecret"
                                                    checked={isSecret}
                                                    onCheckedChange={
                                                        setIsSecret
                                                    }
                                                />
                                                <Label htmlFor="isSecret">
                                                    Secret Test
                                                </Label>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Secret tests are not visible to
                                                students and are used for
                                                additional validation.
                                            </p>
                                        </div>

                                        <div className="pt-4">
                                            <Button
                                                onClick={handleSubmit}
                                                disabled={isSubmitting}
                                                className="w-full"
                                            >
                                                {isSubmitting
                                                    ? "Saving..."
                                                    : isCreating
                                                      ? "Create Test"
                                                      : "Update Test"}
                                            </Button>
                                        </div>
                                    </TabsContent>

                                    <TabsContent
                                        value="custom"
                                        className="h-full flex flex-col p-4"
                                    >
                                        <div className="flex-1">
                                            <MonacoEditor
                                                language={getMonacoLanguage(
                                                    language,
                                                )}
                                                value={customValidationCode}
                                                onChange={(value) =>
                                                    setCustomValidationCode(
                                                        value || "",
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="p-4 border-t">
                                            <Button
                                                onClick={handleSubmit}
                                                disabled={isSubmitting}
                                                className="w-full"
                                            >
                                                {isSubmitting
                                                    ? "Saving..."
                                                    : isCreating
                                                      ? "Create Test"
                                                      : "Update Test"}
                                            </Button>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        )}

                        {!isCreating && !selectedTest && (
                            <div className="h-full flex items-center justify-center text-muted-foreground">
                                <div className="text-center">
                                    <TestTube className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg mb-2">
                                        No test selected
                                    </p>
                                    <p className="text-sm">
                                        Select a test from the left panel or
                                        create a new one
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </section>
    );
}
