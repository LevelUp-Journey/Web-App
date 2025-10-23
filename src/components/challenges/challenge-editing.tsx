"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import CodeVersionsList from "@/components/challenges/code-versions-list";
import DeleteChallengeButton from "@/components/challenges/delete-challenge-button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChallengeDifficulty } from "@/lib/consts";
import { PATHS } from "@/lib/paths";
import type { CodeVersion } from "@/services/internal/challenges/challenge/entities/code-version.entity";
import type { Challenge } from "@/services/internal/challenges/entities/challenge.entity";

const formSchema = z.object({
    title: z
        .string()
        .min(5, "Challenge title must be at least 5 characters.")
        .max(32, "Challenge title must be at most 32 characters."),
    tags: z.string().optional(),
    difficulty: z.enum(ChallengeDifficulty),
    experiencePoints: z
        .number()
        .min(0, "Experience points must be at least 0.")
        .max(1000, "Experience points must be at most 1000."),
});

type FormData = z.infer<typeof formSchema>;

interface ChallengeEditingProps {
    challengeId: string;
    initialChallenge: Challenge;
    initialCodeVersions: CodeVersion[];
}

export default function ChallengeEditing({
    challengeId,
    initialChallenge,
    initialCodeVersions,
}: ChallengeEditingProps) {
    const router = useRouter();
    const editorRef = useRef<ShadcnTemplateRef>(null);

    const [codeVersions, setCodeVersions] =
        useState<CodeVersion[]>(initialCodeVersions);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialChallenge.name,
            tags: initialChallenge.tags.map((tag) => tag.name).join(", "),
            difficulty: ChallengeDifficulty.EASY, // TODO: Get from backend
            experiencePoints: initialChallenge.experiencePoints,
        },
    });

    const getEditorContent = () => {
        return editorRef.current?.getMarkdown() || "";
    };

    const onSubmit = form.handleSubmit(async (data: FormData) => {});

    const handleDelete = async () => {};

    const handleViewSummary = () => {
        router.push(`?`);
    };

    const handleAddVersion = () => {
        router.push(PATHS.DASHBOARD.CHALLENGES.VERSIONS.NEW(challengeId));
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

    return (
        <section className="h-screen flex flex-col p-4 container mx-auto">
            {/* Header */}
            <header className="shrink-0 p-6 border-b flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Edit Challenge</h1>
                    <p className="text-muted-foreground">
                        Update the challenge details and description.
                    </p>
                </div>
                <div className="flex gap-4">
                    <DeleteChallengeButton challengeId={challengeId} />
                    <Button onClick={handleAddVersion}>Add Code Version</Button>
                    <Button variant="outline" onClick={handleViewSummary}>
                        View Summary
                    </Button>
                </div>
            </header>

            {/* Resizable panels */}
            <div className="flex-1 overflow-hidden">
                <ResizablePanelGroup direction="horizontal" className="h-full">
                    {/* Left Column - Tabs for Basic Info and Languages */}
                    <ResizablePanel defaultSize={40} minSize={30}>
                        <div className="h-full overflow-y-auto p-6">
                            <Tabs defaultValue="basic" className="h-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="basic">
                                        Basic Information
                                    </TabsTrigger>
                                    <TabsTrigger value="languages">
                                        Available Languages
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent
                                    value="basic"
                                    className="space-y-6 mt-6"
                                >
                                    {/* Edit Form */}
                                    <form
                                        onSubmit={onSubmit}
                                        className="space-y-4"
                                    >
                                        <Controller
                                            name="title"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field
                                                    data-invalid={
                                                        fieldState.invalid
                                                    }
                                                >
                                                    <FieldLabel
                                                        htmlFor={field.name}
                                                    >
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
                                                            errors={[
                                                                fieldState.error,
                                                            ]}
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
                                                    data-invalid={
                                                        fieldState.invalid
                                                    }
                                                >
                                                    <FieldLabel
                                                        htmlFor={field.name}
                                                    >
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
                                                            errors={[
                                                                fieldState.error,
                                                            ]}
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
                                                    data-invalid={
                                                        fieldState.invalid
                                                    }
                                                >
                                                    <FieldLabel
                                                        htmlFor={field.name}
                                                    >
                                                        Difficulty Level
                                                    </FieldLabel>
                                                    <Select
                                                        name={field.name}
                                                        value={field.value}
                                                        onValueChange={
                                                            field.onChange
                                                        }
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
                                                            errors={[
                                                                fieldState.error,
                                                            ]}
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
                                                    data-invalid={
                                                        fieldState.invalid
                                                    }
                                                >
                                                    <FieldLabel
                                                        htmlFor={field.name}
                                                    >
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
                                                                Number(
                                                                    e.target
                                                                        .value,
                                                                ),
                                                            )
                                                        }
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError
                                                            errors={[
                                                                fieldState.error,
                                                            ]}
                                                        />
                                                    )}
                                                </Field>
                                            )}
                                        />

                                        <div className="flex gap-4">
                                            <Button
                                                type="submit"
                                                disabled={
                                                    form.formState.isSubmitting
                                                }
                                            >
                                                {form.formState.isSubmitting
                                                    ? "Saving..."
                                                    : "Save Changes"}
                                            </Button>
                                        </div>
                                    </form>
                                </TabsContent>
                                <TabsContent
                                    value="languages"
                                    className="space-y-6 mt-6"
                                >
                                    <CodeVersionsList
                                        challengeId={challengeId}
                                        codeVersions={codeVersions}
                                        variant="editing"
                                        isTeacher={true}
                                    />
                                </TabsContent>
                            </Tabs>
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
