"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
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
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";
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
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDictionary } from "@/hooks/use-dictionary";
import {
    CHALLENGE_DIFFICULTY_MAX_XP,
    ChallengeDifficulty,
    MAX_CHALLENGE_EXPERIENCE_POINTS,
} from "@/lib/consts";
import { PATHS } from "@/lib/paths";
import { ChallengeController } from "@/services/internal/challenges/challenge/controller/challenge.controller";
import type { Challenge } from "@/services/internal/challenges/challenge/entities/challenge.entity";
import type { CodeVersion } from "@/services/internal/challenges/challenge/entities/code-version.entity";

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
        .max(
            MAX_CHALLENGE_EXPERIENCE_POINTS,
            `Experience points must be at most ${MAX_CHALLENGE_EXPERIENCE_POINTS}.`,
        ),
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
    const dict = useDictionary();
    const editorRef = useRef<ShadcnTemplateRef>(null);
    const [editorMethods, setEditorMethods] =
        useState<ShadcnTemplateRef | null>(null);
    const [challengeData, setChallengeData] =
        useState<Challenge>(initialChallenge);
    const [isSaving, setIsSaving] = useState(false);

    const [codeVersions, setCodeVersions] =
        useState<CodeVersion[]>(initialCodeVersions);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: challengeData.name,
            tags: challengeData.tags.map((tag) => tag.name).join(", "),
            difficulty: challengeData.difficulty ?? ChallengeDifficulty.EASY,
            experiencePoints: Math.min(
                challengeData.experiencePoints,
                CHALLENGE_DIFFICULTY_MAX_XP[
                    challengeData.difficulty ?? ChallengeDifficulty.EASY
                ],
            ),
        },
    });
    useEffect(() => {
        setChallengeData(initialChallenge);
    }, [initialChallenge]);

    useEffect(() => {
        form.reset({
            title: challengeData.name,
            tags: challengeData.tags.map((tag) => tag.name).join(", "),
            difficulty: challengeData.difficulty ?? ChallengeDifficulty.EASY,
            experiencePoints: Math.min(
                challengeData.experiencePoints,
                CHALLENGE_DIFFICULTY_MAX_XP[
                    challengeData.difficulty ?? ChallengeDifficulty.EASY
                ],
            ),
        });
    }, [challengeData, form]);

    const difficulty = form.watch("difficulty");
    const maxExperiencePoints = CHALLENGE_DIFFICULTY_MAX_XP[difficulty];

    const getEditorContent = () => {
        return (
            editorMethods?.getMarkdown() ||
            editorRef.current?.getMarkdown() ||
            challengeData.description ||
            ""
        );
    };

    const onSubmit = form.handleSubmit(async (data: FormData) => {
        const description = getEditorContent();
        const tagNames = data.tags
            ? data.tags
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter((tag) => tag.length > 0)
            : [];

        try {
            setIsSaving(true);
            const updatedChallenge = await ChallengeController.updateChallenge(
                challengeId,
                {
                    name: data.title,
                    description,
                    experiencePoints: data.experiencePoints,
                    difficulty: data.difficulty,
                    tags: tagNames.length > 0 ? tagNames : undefined,
                },
            );

            setChallengeData(updatedChallenge);

            if (editorMethods || editorRef.current) {
                (editorMethods ?? editorRef.current)?.injectMarkdown(
                    updatedChallenge.description || "",
                );
            }

            toast.success("Challenge updated successfully!");
            router.refresh();
        } catch (error) {
            console.error("Error updating challenge:", error);
            toast.error(
                dict?.errors?.updating?.challenge ||
                    "Failed to update challenge. Please try again.",
            );
        } finally {
            setIsSaving(false);
        }
    });

    const handleDelete = async () => {};

    const handleViewSummary = () => {
        router.push(`?`);
    };

    const handleAddVersion = () => {
        router.push(PATHS.DASHBOARD.CHALLENGES.VERSIONS.NEW(challengeId));
    };

    const handleEditorReady = useCallback((methods: ShadcnTemplateRef) => {
        setEditorMethods(methods);
    }, []);

    useEffect(() => {
        const target = editorMethods ?? editorRef.current;
        if (!target) {
            return;
        }
        target.injectMarkdown(challengeData.description || "");
    }, [challengeData.description, editorMethods]);

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

    useEffect(() => {
        const currentXP = form.getValues("experiencePoints");
        if (currentXP > maxExperiencePoints) {
            form.setValue("experiencePoints", maxExperiencePoints, {
                shouldDirty: true,
            });
        }
    }, [form, maxExperiencePoints]);

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
                                                    <FieldDescription>
                                                        {difficulty} challenges
                                                        can award up to{" "}
                                                        {maxExperiencePoints}{" "}
                                                        XP. Move the slider to
                                                        adjust the reward.
                                                    </FieldDescription>
                                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                        <span className="font-semibold text-foreground">
                                                            {field.value ?? 0}{" "}
                                                            XP
                                                        </span>
                                                        <span>
                                                            Max{" "}
                                                            {
                                                                maxExperiencePoints
                                                            }{" "}
                                                            XP
                                                        </span>
                                                    </div>
                                                    <Slider
                                                        value={[
                                                            field.value ?? 0,
                                                        ]}
                                                        min={0}
                                                        max={
                                                            maxExperiencePoints
                                                        }
                                                        step={1}
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            field.onChange(
                                                                value[0] ?? 0,
                                                            )
                                                        }
                                                        aria-label="Experience points slider"
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
                                                    isSaving ||
                                                    form.formState.isSubmitting
                                                }
                                            >
                                                {isSaving ||
                                                form.formState.isSubmitting
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
                            <ShadcnTemplate
                                ref={editorRef}
                                onReady={handleEditorReady}
                            />
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </section>
    );
}
