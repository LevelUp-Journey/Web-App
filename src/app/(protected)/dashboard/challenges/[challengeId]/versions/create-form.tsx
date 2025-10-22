"use client";

import Editor from "@monaco-editor/react";
import type { SVGProps } from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { CPlusPlus } from "@/components/ui/svgs/cplusplus";
import { Java } from "@/components/ui/svgs/java";
import { Javascript } from "@/components/ui/svgs/javascript";
import { Python } from "@/components/ui/svgs/python";
import { getReadableLanguageName, ProgrammingLanguage } from "@/lib/consts";
import { PATHS } from "@/lib/paths";
import { CodeVersionController } from "@/services/internal/challenges/controller/code-version.controller";

const getCodeTemplate = (language: ProgrammingLanguage): string => {
    switch (language) {
        case ProgrammingLanguage.JAVASCRIPT:
            return `function solution(input) {\n    // Your code here\n    return input;\n}`;
        case ProgrammingLanguage.PYTHON:
            return `def solution(input):\n    # Your code here\n    return input`;
        case ProgrammingLanguage.JAVA:
            return `public class Solution {\n    public static Object solution(Object input) {\n        // Your code here\n        return input;\n    }\n}`;
        case ProgrammingLanguage.C_PLUS_PLUS:
            return `#include <iostream>\n\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}`;
        default:
            return `// Your code here`;
    }
};

const getFunctionNameFromCode = (
    language: ProgrammingLanguage,
    code: string,
): string => {
    let regex: RegExp;
    switch (language) {
        case ProgrammingLanguage.JAVASCRIPT:
            regex = /function\s+(\w+)\s*\(/;
            break;
        case ProgrammingLanguage.PYTHON:
            regex = /def\s+(\w+)\s*\(/;
            break;
        case ProgrammingLanguage.JAVA:
            regex = /public static \w+ (\w+)\s*\(/;
            break;
        case ProgrammingLanguage.C_PLUS_PLUS:
            regex = /(?:int|void)\s+(\w+)\s*\(/;
            break;
        default:
            return "";
    }
    const match = code.match(regex);
    return match ? match[1] : "";
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

const languageIcons: Record<
    ProgrammingLanguage,
    React.ComponentType<SVGProps<SVGSVGElement>>
> = {
    [ProgrammingLanguage.JAVASCRIPT]: Javascript,
    [ProgrammingLanguage.PYTHON]: Python,
    [ProgrammingLanguage.JAVA]: Java,
    [ProgrammingLanguage.C_PLUS_PLUS]: CPlusPlus,
};

interface CreateCodeVersionFormProps {
    challengeId: string;
}

type Step = "select" | "edit";

export default function CreateCodeVersionForm({
    challengeId,
}: CreateCodeVersionFormProps) {
    const [step, setStep] = useState<Step>("select");
    const [selectedLanguage, setSelectedLanguage] =
        useState<ProgrammingLanguage | null>(null);
    const [functionName, setFunctionName] = useState("");
    const [code, setCode] = useState("");

    const handleLanguageSelect = (language: ProgrammingLanguage) => {
        setSelectedLanguage(language);
        const template = getCodeTemplate(language);
        setCode(template);
        const detectedName = getFunctionNameFromCode(language, template);
        setFunctionName(detectedName);
        setStep("edit");
    };

    useEffect(() => {
        if (selectedLanguage && code) {
            const detectedName = getFunctionNameFromCode(
                selectedLanguage,
                code,
            );
            setFunctionName(detectedName);
        }
    }, [code, selectedLanguage]);

    const handleBack = () => {
        setStep("select");
        setSelectedLanguage(null);
        setFunctionName("");
        setCode("");
    };

    const handleSubmit = async () => {
        if (!selectedLanguage || !functionName.trim() || !code.trim()) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            const newCodeVersion =
                await CodeVersionController.createCodeVersion(challengeId, {
                    challengeId,
                    language: selectedLanguage,
                    defaultCode: code,
                    functionName: functionName.trim(),
                });
            toast.success("Code version created successfully!");
            window.location.href = PATHS.DASHBOARD.CHALLENGES.VERSIONS.EDIT(
                challengeId,
                newCodeVersion.id,
            );
        } catch (error) {
            console.error("Error creating code version:", error);
            toast.error("Failed to create code version. Please try again.");
        }
    };

    if (step === "select") {
        return (
            <div className="container mx-auto p-4 max-w-4xl">
                <h1 className="text-2xl font-semibold mb-6">
                    Select Programming Language
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {Object.values(ProgrammingLanguage).map((language) => {
                        const IconComponent = languageIcons[language];
                        return (
                            <Button
                                key={language}
                                variant="outline"
                                className="h-auto p-4 flex flex-row items-center gap-2 hover:bg-accent"
                                onClick={() => handleLanguageSelect(language)}
                            >
                                <IconComponent className="w-8 h-8" />
                                <span className="text-sm font-medium">
                                    {getReadableLanguageName(language)}
                                </span>
                            </Button>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <section className="h-screen flex flex-col container mx-auto p-4 max-w-full">
            <header className="shrink-0 p-4 border-b flex items-center gap-4">
                <Button variant="outline" onClick={handleBack}>
                    Back
                </Button>
                <h1 className="text-2xl font-semibold">
                    Create Code Version -{" "}
                    {getReadableLanguageName(selectedLanguage!)}
                </h1>
            </header>

            <div className="flex-1 flex overflow-hidden">
                <div className="w-80 shrink-0 border-r p-4 flex flex-col gap-4">
                    <Field>
                        <FieldLabel htmlFor="functionName">
                            Function Name
                        </FieldLabel>
                        <Input
                            id="functionName"
                            value={functionName}
                            onChange={(e) => setFunctionName(e.target.value)}
                            placeholder="Enter function name"
                            autoComplete="off"
                        />
                        <FieldDescription>
                            The name of the function to implement (automatically
                            detected from code).
                        </FieldDescription>
                    </Field>
                    <Button onClick={handleSubmit} className="w-full">
                        Create Code Version
                    </Button>
                </div>
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-4 border-b shrink-0">
                        <h2 className="text-lg font-semibold">Code Template</h2>
                        <p className="text-sm text-muted-foreground">
                            Modify the code template as needed.
                        </p>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <Editor
                            height="100%"
                            language={getMonacoLanguage(selectedLanguage!)}
                            value={code}
                            onChange={(value) => setCode(value || "")}
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
            </div>
        </section>
    );
}
