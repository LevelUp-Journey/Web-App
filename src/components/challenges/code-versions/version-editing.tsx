"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
import MonacoEditor from "../monaco/monaco-editor";

interface VersionEditingProps {
    challengeId: string;
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

const getInitialCode = (language: ProgrammingLanguage): string => {
    switch (language) {
        case ProgrammingLanguage.JAVASCRIPT:
            return "function solution() {\n    // Your code here\n}";
        case ProgrammingLanguage.PYTHON:
            return "def solution():\n    # Your code here\n    pass";
        case ProgrammingLanguage.JAVA:
            return "public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}";
        case ProgrammingLanguage.C_PLUS_PLUS:
            return "#include <iostream>\n\nint main() {\n    // Your code here\n    return 0;\n}";
        default:
            return "// Your code here";
    }
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

export default function VersionEditing({ challengeId }: VersionEditingProps) {
    const router = useRouter();
    const [selectedLanguage, setSelectedLanguage] =
        useState<ProgrammingLanguage | null>(null);
    const [initialCode, setInitialCode] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSelectLanguage = (language: ProgrammingLanguage) => {
        setSelectedLanguage(language);
        setInitialCode(getInitialCode(language));
    };

    const handleCreateCodeVersion = async () => {
        if (!selectedLanguage) return;

        setIsSubmitting(true);
        try {
            const codeVersion = await CodeVersionController.createCodeVersion(
                challengeId,
                {
                    challengeId,
                    language: selectedLanguage,
                    defaultCode: initialCode,
                    functionName: "",
                },
            );
            toast.success("Code version added successfully");
            // Redirect to tests page with both challengeId and codeVersionId
            router.push(
                PATHS.DASHBOARD.CHALLENGES.TESTS.NEW(
                    challengeId,
                    codeVersion.id,
                ),
            );
        } catch (error) {
            console.error("Error adding code version:", error);
            toast.error("Failed to add code version");
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
                        Add Code Version
                    </h1>
                    <p className="text-muted-foreground">
                        Select a programming language and write the initial code
                        for this challenge.
                    </p>
                </div>
                <Button
                    onClick={handleCreateCodeVersion}
                    disabled={!selectedLanguage || isSubmitting}
                >
                    {isSubmitting ? "Creating..." : "Add Code Version"}
                </Button>
            </header>

            {/* Resizable panels */}
            <ResizablePanelGroup direction="horizontal" className="h-full">
                {/* Left Panel - Language Selection */}
                <ResizablePanel defaultSize={30} minSize={25}>
                    <div className="h-full overflow-y-auto p-6">
                        <h2 className="text-xl font-semibold mb-4">
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
                                        handleSelectLanguage(lang.key)
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
                            {selectedLanguage ? (
                                <MonacoEditor
                                    language={getMonacoLanguage(
                                        selectedLanguage,
                                    )}
                                    value={initialCode}
                                    onChange={(value) =>
                                        setInitialCode(value || "")
                                    }
                                />
                            ) : (
                                <div className="h-full flex items-center justify-center text-muted-foreground">
                                    <div className="text-center">
                                        <p className="text-lg mb-2">
                                            Select a language first
                                        </p>
                                        <p className="text-sm">
                                            Choose a programming language from
                                            the left panel to start editing
                                            code.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </section>
    );
}
