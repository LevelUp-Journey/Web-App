"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import {
    ShadcnTemplate,
    type ShadcnTemplateRef,
} from "@/components/challenges/editor/lexkitEditor";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ChallengeDifficulty } from "@/lib/consts";
import { ChallengeController } from "@/services/internal/challenges/controller/challenge.controller";
import type { CreateChallengeRequest } from "@/services/internal/challenges/controller/challenge.response";

const formSchema = z.object({
    title: z
        .string()
        .min(5, "Challenge title must be at least 5 characters.")
        .max(32, "Challenge title must be at most 32 characters."),
    tags: z.string().optional(),
    difficulty: z.nativeEnum(ChallengeDifficulty),
    experiencePoints: z
        .number()
        .min(0, "Experience points must be at least 0.")
        .max(1000, "Experience points must be at most 1000."),
});

type FormData = z.infer<typeof formSchema>;

export default function ChallengeEditPage() {
    const params = useParams();
    const challengeId = params.challengeId as string;
    const router = useRouter();
    const editorRef = useRef<ShadcnTemplateRef>(null);

    const [challenge, setChallenge] = useState<any>(null); // Mock data
    const [loading, setLoading] = useState(true);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            tags: "",
            difficulty: ChallengeDifficulty.EASY,
            experiencePoints: 100,
        },
    });

    useEffect(() => {
        // Mock fetch challenge
        const mockChallenge = {
            id: challengeId,
            name: "Sample Challenge",
            description: "# Sample Description\n\nThis is a sample challenge.",
            tags: ["JavaScript", "React"],
            difficulty: ChallengeDifficulty.MEDIUM,
            experiencePoints: 150,
            codeVersions: [
                { id: "1", name: "Version 1", language: "JavaScript" },
                { id: "2", name: "Version 2", language: "Python" },
            ],
        };
        setChallenge(mockChallenge);
        form.reset({
            title: mockChallenge.name,
            tags: mockChallenge.tags.join(", "),
            difficulty: mockChallenge.difficulty,
            experiencePoints: mockChallenge.experiencePoints,
        });
        setLoading(false);
    }, [challengeId, form]);

    const getEditorContent = () => {
        return editorRef.current?.getMarkdown() || "";
    };

    const onSubmit = form.handleSubmit(async (data: FormData) => {
        const markdown = getEditorContent();

        const tagIds = data.tags
            ? data.tags
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter((tag) => tag.length > 0)
            : [];

        const request: CreateChallengeRequest = {
            teacherId: "00000000-0000-0000-0000-000000000000",
            name: data.title,
            description: markdown,
            experiencePoints: data.experiencePoints,
            difficulty: data.difficulty,
            tagIds,
        };

        try {
            // Assume update method exists
            await ChallengeController.createChallenge(request); // Placeholder
            toast.success("Challenge updated successfully!");
        } catch (error) {
            console.error("Error updating challenge:", error);
            toast.error("Failed to update challenge. Please try again.");
        }
    });

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this challenge?")) {
            try {
                // Assume delete method exists
                toast.success("Challenge deleted successfully!");
                router.push("/dashboard/admin");
            } catch (error) {
                toast.error("Failed to delete challenge.");
            }
        }
    };

    const handleAddVersion = () => {
        router.push(`/dashboard/challenges/edit/${challengeId}/versions/add`);
    };

    useEffect(() => {
        const errors = form.formState.errors;
        if (Object.keys(errors).length > 0) {
            Object.entries(errors).forEach(([field, error]) => {
                if (error?.message) {
                    toast.error(`${field}: ${error.message}`);
                }
            });
        }
    }, [form.formState.errors]);

    if (loading) return <div>Loading...</div>;

    return (
        <section className="h-screen flex flex-col p-4 container mx-auto">
            {/* Header */}
            <header className="flex-shrink-0 p-6 border-b flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Edit Challenge</h1>
                    <p className="text-muted-foreground">
                        Update the challenge details and description.
                    </p>
                </div>
                <Button onClick={handleAddVersion}>Add Code Version</Button>
            </header>

            {/* Resizable panels */}
            <div className="flex-1 overflow-hidden">
                <ResizablePanelGroup direction="horizontal" className="h-full">
                    {/* Left Column - Edit Form and Summary */}
                    <ResizablePanel defaultSize={40} minSize={30}>
                        <div className="h-full overflow-y-auto p-6 space-y-6">
                            {/* Challenge Summary */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">
                                    Challenge Summary
                                </h2>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <strong>Title:</strong> {challenge.name}
                                    </div>
                                    <div>
                                        <strong>Difficulty:</strong>{" "}
                                        {challenge.difficulty}
                                    </div>
                                    <div>
                                        <strong>Experience Points:</strong>{" "}
                                        {challenge.experiencePoints}
                                    </div>
                                    <div>
                                        <strong>Tags:</strong>{" "}
                                        {challenge.tags.join(", ")}
                                    </div>
                                </div>
                            </div>

                            {/* Edit Form */}
                            <form onSubmit={onSubmit} className="space-y-4">
                                <h2 className="text-xl font-semibold">
                                    Edit Details
                                </h2>

                                <Controller
                                    name="title"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor={field.name}>
                                                Challenge Title
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id={field.name}
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder="Enter challenge title"
                                                autoComplete="off"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="tags"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor={field.name}>
                                                Tags (comma separated)
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id={field.name}
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder="e.g., JavaScript, React, Node.js"
                                                autoComplete="off"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="difficulty"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor={field.name}>
                                                Difficulty Level
                                            </FieldLabel>
                                            <Select
                                                name={field.name}
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger
                                                    id={field.name}
                                                    aria-invalid={
                                                        fieldState.invalid
                                                    }
                                                >
                                                    <SelectValue placeholder="Select difficulty" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem
                                                        value={
                                                            ChallengeDifficulty.EASY
                                                        }
                                                    >
                                                        Easy
                                                    </SelectItem>
                                                    <SelectItem
                                                        value={
                                                            ChallengeDifficulty.MEDIUM
                                                        }
                                                    >
                                                        Medium
                                                    </SelectItem>
                                                    <SelectItem
                                                        value={
                                                            ChallengeDifficulty.HARD
                                                        }
                                                    >
                                                        Hard
                                                    </SelectItem>
                                                    <SelectItem
                                                        value={
                                                            ChallengeDifficulty.EXPERT
                                                        }
                                                    >
                                                        Expert
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="experiencePoints"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor={field.name}>
                                                Experience Points
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id={field.name}
                                                type="number"
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                min="0"
                                                placeholder="100"
                                                onChange={(e) =>
                                                    field.onChange(
                                                        Number(e.target.value),
                                                    )
                                                }
                                            />
                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    )}
                                />

                                <div className="flex gap-4">
                                    <Button
                                        type="submit"
                                        disabled={form.formState.isSubmitting}
                                    >
                                        {form.formState.isSubmitting
                                            ? "Saving..."
                                            : "Save Changes"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={handleDelete}
                                    >
                                        Delete Challenge
                                    </Button>
                                </div>
                            </form>

                            {/* Code Versions Shortcuts */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">
                                    Code Versions
                                </h2>
                                <div className="space-y-2">
                                    {challenge.codeVersions.map(
                                        (version: any) => (
                                            <div
                                                key={version.id}
                                                className="flex justify-between items-center p-2 border rounded"
                                            >
                                                <div>
                                                    <strong>
                                                        {version.name}
                                                    </strong>{" "}
                                                    - {version.language}
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    Edit
                                                </Button>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    {/* Right Column - Description Editor */}
                    <ResizablePanel defaultSize={60} maxSize={70} minSize={50}>
                        <div className="h-full overflow-y-auto border-l">
                            <ShadcnTemplate ref={editorRef} />
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </section>
    );
}
