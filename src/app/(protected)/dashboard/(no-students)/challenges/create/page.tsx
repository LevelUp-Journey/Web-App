"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
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
import { PATHS } from "@/lib/paths";
import { ChallengeController } from "@/services/internal/challenges/controller/challenge.controller";
import type { CreateChallengeRequest } from "@/services/internal/challenges/controller/challenge.response";

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
        .max(100, "Experience points must be at most 1000."),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateChallengePage() {
    const router = useRouter();
    const editorRef = useRef<ShadcnTemplateRef>(null);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            tags: "",
            difficulty: ChallengeDifficulty.EASY,
            experiencePoints: 100,
        },
    });

    const getEditorContent = () => {
        return editorRef.current?.getMarkdown() || "";
    };

    const onSubmit = form.handleSubmit(async (data: FormData) => {
        const markdown = getEditorContent();

        // Parse tags
        const tagIds = data.tags
            ? data.tags
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter((tag) => tag.length > 0)
            : [];

        const request: CreateChallengeRequest = {
            name: data.title,
            description: markdown,
            experiencePoints: data.experiencePoints,
            difficulty: data.difficulty,
            tagIds,
        };

        try {
            const challenge =
                await ChallengeController.createChallenge(request);
            toast.success("Challenge created successfully!");
            router.push(PATHS.DASHBOARD.CHALLENGES.VERSIONS.ADD(challenge.id));
        } catch (error) {
            console.error("Error creating challenge:", error);
            toast.error("Failed to create challenge. Please try again.");
        }
    });

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
            {/* Header - Fixed height */}
            <header className="shrink-0 p-6 border-b">
                <h1 className="text-3xl font-bold mb-2">
                    Create New Challenge
                </h1>
                <p className="text-muted-foreground">
                    Fill in the details below to create a new challenge for
                    students.
                </p>
            </header>

            {/* Resizable panels - Takes remaining height */}
            <ResizablePanelGroup direction="horizontal" className="h-full">
                {/* Left Column - Form Fields */}
                <ResizablePanel defaultSize={40} minSize={30}>
                    <form
                        onSubmit={onSubmit}
                        className="h-full overflow-y-auto p-6 flex flex-col gap-4"
                    >
                        {/* Title */}
                        <Controller
                            name="title"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Challenge Title
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
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

                        {/* Tags */}
                        <Controller
                            name="tags"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Tags (comma separated)
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
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

                        {/* Difficulty */}
                        <Controller
                            name="difficulty"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
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
                                            aria-invalid={fieldState.invalid}
                                        >
                                            <SelectValue placeholder="Select difficulty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem
                                                value={ChallengeDifficulty.EASY}
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
                                                value={ChallengeDifficulty.HARD}
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

                        {/* Experience Points */}
                        <Controller
                            name="experiencePoints"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Experience Points
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        type="number"
                                        aria-invalid={fieldState.invalid}
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

                        <div className="text-end">
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting
                                    ? "Creating..."
                                    : "Create Challenge"}
                            </Button>
                        </div>
                    </form>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Right Column - Rich Text Editor */}
                <ResizablePanel defaultSize={60} maxSize={70} minSize={30}>
                    <div className="h-full overflow-y-auto border-l">
                        <ShadcnTemplate ref={editorRef} />
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </section>
    );
}
