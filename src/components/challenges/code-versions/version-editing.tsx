"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CodeVersionController } from "@/services/internal/challenges/controller/code-version.controller";
import type { CodeVersion } from "@/services/internal/challenges/entities/code-version.entity";
import { CPlusPlus } from "@/components/ui/svgs/cplusplus";
import { Java } from "@/components/ui/svgs/java";
import { Javascript } from "@/components/ui/svgs/javascript";
import { Python } from "@/components/ui/svgs/python";

interface VersionEditingProps {
    challengeId: string;
}

const languages = [
    { key: "JAVASCRIPT", name: "JavaScript", icon: Javascript },
    { key: "PYTHON", name: "Python", icon: Python },
    { key: "JAVA", name: "Java", icon: Java },
    { key: "C_PLUS_PLUS", name: "C++", icon: CPlusPlus },
];

const getInitialCode = (language: string): string => {
    switch (language) {
        case "JAVASCRIPT":
            return "function solution() {\n    // Your code here\n}";
        case "PYTHON":
            return "def solution():\n    # Your code here\n    pass";
        case "JAVA":
            return "public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}";
        case "C_PLUS_PLUS":
            return "#include <iostream>\n\nint main() {\n    // Your code here\n    return 0;\n}";
        default:
            return "// Your code here";
    }
};

export default function VersionEditing({ challengeId }: VersionEditingProps) {
    const router = useRouter();

    const handleSelectLanguage = async (language: string) => {
        const initialCode = getInitialCode(language);
        try {
            await CodeVersionController.createCodeVersion(challengeId, {
                language,
                initialCode,
            });
            toast.success("Code version added successfully");
            router.push(`?`); // Navigate back to summary
        } catch (error) {
            console.error("Error adding code version:", error);
            toast.error("Failed to add code version");
        }
    };

    return (
        <section className="h-screen flex flex-col p-4 container mx-auto">
            <header className="flex-shrink-0 p-6 border-b">
                <h1 className="text-3xl font-bold mb-2">Add Code Version</h1>
                <p className="text-muted-foreground">
                    Select a programming language to add a new code version for
                    this challenge.
                </p>
            </header>

            <div className="flex-1 overflow-hidden p-6">
                <div className="grid grid-cols-2 gap-6">
                    {languages.map((lang) => (
                        <button
                            key={lang.key}
                            type="button"
                            onClick={() => handleSelectLanguage(lang.key)}
                            className="p-6 border rounded-lg bg-card hover:bg-accent transition-colors text-left"
                        >
                            <div className="flex items-center space-x-4">
                                <lang.icon className="w-12 h-12" />
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        {lang.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Click to add a {lang.name} version
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
