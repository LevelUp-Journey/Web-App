"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PATHS } from "@/lib/paths";
import { CodeVersionController } from "@/services/internal/challenges/challenge/controller/code-version.controller";
import type { CodeVersion } from "@/services/internal/challenges/challenge/entities/code-version.entity";

interface VersionEditingFormProps {
    challengeId: string;
    codeVersion: CodeVersion;
}

export default function VersionEditingForm({
    challengeId,
    codeVersion,
}: VersionEditingFormProps) {
    const router = useRouter();
    const [language, setLanguage] = useState(codeVersion.language);
    const [initialCode, setInitialCode] = useState(codeVersion.initialCode);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await CodeVersionController.updateCodeVersion(
                challengeId,
                codeVersion.id,
                {
                    code: initialCode,
                    functionName: codeVersion.functionName || null,
                },
            );
            toast.success("Code version updated successfully");
            router.push(
                PATHS.DASHBOARD.CHALLENGES.VERSIONS.EDIT(
                    challengeId,
                    codeVersion.id,
                ),
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
            <header className="shrink-0 p-6 border-b">
                <h1 className="text-3xl font-bold mb-2">Edit Code Version</h1>
                <p className="text-muted-foreground">
                    Update the language and initial code for this code version.
                </p>
            </header>

            <div className="flex-1 overflow-hidden p-6">
                <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                    <div>
                        <Label htmlFor="language">Language</Label>
                        <Input
                            id="language"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="initialCode">Initial Code</Label>
                        <Textarea
                            id="initialCode"
                            value={initialCode}
                            onChange={(e) => setInitialCode(e.target.value)}
                            rows={20}
                            required
                        />
                    </div>
                    <div className="flex gap-4">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting
                                ? "Updating..."
                                : "Update Code Version"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    );
}
