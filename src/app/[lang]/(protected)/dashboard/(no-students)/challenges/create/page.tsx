"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
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
import type { CreateChallengeRequest } from "@/services/internal/challenges/challenge/controller/challenge.response";
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";
import type { GuideResponse } from "@/services/internal/learning/guides/controller/guide.response";

export default function CreateChallengePage() {
    const router = useRouter();
    const editorRef = useRef<ShadcnTemplateRef>(null);
    const dict = useDictionary();

    // Guides tab state
    const [searchTerm, setSearchTerm] = useState("");
    const [guides, setGuides] = useState<GuideResponse[]>([]);
    const [selectedGuides, setSelectedGuides] = useState<GuideResponse[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const formSchema = z.object({
        title: z
            .string()
            .min(
                5,
                dict?.createChallenge.validation.titleMin ||
                    "Challenge title must be at least 5 characters.",
            )
            .max(
                32,
                dict?.createChallenge.validation.titleMax ||
                    "Challenge title must be at most 32 characters.",
            ),
        tags: z.string().optional(),
        difficulty: z.enum(ChallengeDifficulty),
        experiencePoints: z
            .number()
            .min(
                0,
                dict?.createChallenge.validation.xpMin ||
                    "Experience points must be at least 0.",
            )
            .max(
                MAX_CHALLENGE_EXPERIENCE_POINTS,
                dict?.createChallenge.validation.xpMax.replace(
                    "{maxXP}",
                    MAX_CHALLENGE_EXPERIENCE_POINTS.toString(),
                ) ||
                    `Experience points must be at most ${MAX_CHALLENGE_EXPERIENCE_POINTS}.`,
            ),
        maxAttemptsBeforeGuides: z
            .number()
            .min(2, "Max attempts before guides must be at least 2.")
            .max(5, "Max attempts before guides must be at most 5."),
    });

    type FormData = z.infer<typeof formSchema>;

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            tags: "",
            difficulty: ChallengeDifficulty.EASY,
            experiencePoints:
                CHALLENGE_DIFFICULTY_MAX_XP[ChallengeDifficulty.EASY],
            maxAttemptsBeforeGuides: 3,
        },
    });
    const difficulty = form.watch("difficulty");
    const maxExperiencePoints = CHALLENGE_DIFFICULTY_MAX_XP[difficulty];

    const getEditorContent = () => {
        return editorRef.current?.getMarkdown() || "";
    };

    // Guides search with debounce
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(async () => {
            if (searchTerm.trim()) {
                setIsSearching(true);
                try {
                    const results = await GuideController.searchGuides({
                        title: searchTerm,
                    });
                    setGuides(results || []);
                } catch (error) {
                    setGuides([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setGuides([]);
            }
        }, 500); // 500ms debounce

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [searchTerm]);

    const handleSelectGuide = (guide: GuideResponse) => {
        setSelectedGuides((prev) =>
            prev.some((g) => g.id === guide.id) ? prev : [...prev, guide],
        );
    };

    const handleRemoveGuide = (guide: GuideResponse) => {
        setSelectedGuides((prev) => prev.filter((g) => g.id !== guide.id));
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
            maxAttemptsBeforeGuides: data.maxAttemptsBeforeGuides,
        };

        try {
            // First create the challenge
            const challenge =
                await ChallengeController.createChallenge(request);

            // Then add guides one by one
            if (selectedGuides.length > 0) {
                const guidePromises = selectedGuides.map((guide) =>
                    ChallengeController.addGuideToChallenge(
                        challenge.id,
                        guide.id,
                    ),
                );

                const results = await Promise.allSettled(guidePromises);
                const failedGuides = results.filter(
                    (r) => r.status === "rejected" || !r.value,
                );

                if (failedGuides.length > 0) {
                    toast.warning(
                        `Challenge created but ${failedGuides.length} guide(s) could not be added.`,
                    );
                } else {
                    toast.success(
                        dict?.createChallenge.messages.created ||
                            "Challenge created successfully!",
                    );
                }
            } else {
                toast.success(
                    dict?.createChallenge.messages.created ||
                        "Challenge created successfully!",
                );
            }

            router.push(PATHS.DASHBOARD.CHALLENGES.VERSIONS.NEW(challenge.id));
        } catch (error) {
            console.error("Error creating challenge:", error);
            toast.error(
                dict?.createChallenge.messages.error ||
                    "Failed to create challenge. Please try again.",
            );
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
            {/* Header - Fixed height */}
            <header className="shrink-0 p-6 border-b">
                <h1 className="text-3xl font-bold mb-2">
                    {dict?.createChallenge.title}
                </h1>
                <p className="text-muted-foreground">
                    {dict?.createChallenge.subtitle}
                </p>
            </header>

            {/* Resizable panels - Takes remaining height */}
            <ResizablePanelGroup direction="horizontal" className="h-full">
                {/* Left Column - Tabs */}
                <ResizablePanel defaultSize={40} minSize={30}>
                    <div className="h-full overflow-y-auto p-6">
                        <Tabs defaultValue="basic" className="h-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="basic">
                                    Basic Information
                                </TabsTrigger>
                                <TabsTrigger value="guides">Guides</TabsTrigger>
                            </TabsList>
                            <TabsContent
                                value="basic"
                                className="space-y-6 mt-6"
                            >
                                <form
                                    onSubmit={onSubmit}
                                    className="flex flex-col gap-4"
                                >
                                    {/* Title */}
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
                                                    {
                                                        dict?.createChallenge
                                                            .form.title
                                                    }
                                                </FieldLabel>
                                                <Input
                                                    {...field}
                                                    id={field.name}
                                                    aria-invalid={
                                                        fieldState.invalid
                                                    }
                                                    placeholder={
                                                        dict?.createChallenge
                                                            .form
                                                            .titlePlaceholder
                                                    }
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

                                    {/* Tags */}
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
                                                    {
                                                        dict?.createChallenge
                                                            .form.tags
                                                    }
                                                </FieldLabel>
                                                <Input
                                                    {...field}
                                                    id={field.name}
                                                    aria-invalid={
                                                        fieldState.invalid
                                                    }
                                                    placeholder={
                                                        dict?.createChallenge
                                                            .form
                                                            .tagsPlaceholder
                                                    }
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

                                    {/* Difficulty */}
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
                                                    {
                                                        dict?.createChallenge
                                                            .form.difficulty
                                                    }
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
                                                        <SelectValue
                                                            placeholder={
                                                                dict
                                                                    ?.createChallenge
                                                                    .form
                                                                    .difficultyPlaceholder
                                                            }
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem
                                                            value={
                                                                ChallengeDifficulty.EASY
                                                            }
                                                        >
                                                            {
                                                                dict
                                                                    ?.createChallenge
                                                                    .difficulties
                                                                    .easy
                                                            }
                                                        </SelectItem>
                                                        <SelectItem
                                                            value={
                                                                ChallengeDifficulty.MEDIUM
                                                            }
                                                        >
                                                            {
                                                                dict
                                                                    ?.createChallenge
                                                                    .difficulties
                                                                    .medium
                                                            }
                                                        </SelectItem>
                                                        <SelectItem
                                                            value={
                                                                ChallengeDifficulty.HARD
                                                            }
                                                        >
                                                            {
                                                                dict
                                                                    ?.createChallenge
                                                                    .difficulties
                                                                    .hard
                                                            }
                                                        </SelectItem>
                                                        <SelectItem
                                                            value={
                                                                ChallengeDifficulty.EXPERT
                                                            }
                                                        >
                                                            {
                                                                dict
                                                                    ?.createChallenge
                                                                    .difficulties
                                                                    .expert
                                                            }
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

                                    {/* Experience Points */}
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
                                                    {
                                                        dict?.createChallenge
                                                            .form
                                                            .experiencePoints
                                                    }
                                                </FieldLabel>
                                                <FieldDescription>
                                                    {dict?.createChallenge.form.experiencePointsDescription
                                                        .replace(
                                                            "{difficulty}",
                                                            difficulty.toLowerCase(),
                                                        )
                                                        .replace(
                                                            "{maxXP}",
                                                            maxExperiencePoints.toString(),
                                                        )}
                                                </FieldDescription>
                                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                    <span className="font-semibold text-foreground">
                                                        {field.value ?? 0}{" "}
                                                        {
                                                            dict
                                                                ?.createChallenge
                                                                .form.xp
                                                        }
                                                    </span>
                                                    <span>
                                                        {dict?.createChallenge.form.maxXP.replace(
                                                            "{maxXP}",
                                                            maxExperiencePoints.toString(),
                                                        )}
                                                    </span>
                                                </div>
                                                <Slider
                                                    value={[field.value ?? 0]}
                                                    min={0}
                                                    max={maxExperiencePoints}
                                                    step={1}
                                                    onValueChange={(value) =>
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

                                    <div className="text-end">
                                        <Button
                                            type="submit"
                                            disabled={
                                                form.formState.isSubmitting
                                            }
                                        >
                                            {form.formState.isSubmitting
                                                ? dict?.createChallenge.form
                                                      .creatingButton
                                                : dict?.createChallenge.form
                                                      .createButton}
                                        </Button>
                                    </div>
                                </form>
                            </TabsContent>
                            <TabsContent
                                value="guides"
                                className="space-y-6 mt-6"
                            >
                                <Controller
                                    name="maxAttemptsBeforeGuides"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor={field.name}>
                                                Max Attempts Before Guides
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id={field.name}
                                                type="number"
                                                min={2}
                                                max={5}
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder="3"
                                                autoComplete="off"
                                            />
                                            <FieldDescription>
                                                Number of attempts allowed
                                                before guides become available.
                                            </FieldDescription>
                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    )}
                                />
                                <Field>
                                    <FieldLabel>Search Guides</FieldLabel>
                                    <Input
                                        placeholder="Search guides by title..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                    <FieldDescription>
                                        Type to search for guides. Results will
                                        appear below.
                                    </FieldDescription>
                                </Field>
                                {isSearching && <p>Searching...</p>}
                                {guides.length > 0 && (
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold">
                                            Search Results
                                        </h3>
                                        {guides.map((guide) => (
                                            <div
                                                key={guide.id}
                                                className="flex items-center justify-between p-2 border rounded overflow-hidden"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium">
                                                        {guide.title}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground max-w-[100ch] overflow-hidden text-ellipsis whitespace-nowrap">
                                                        {guide.description}
                                                    </p>
                                                </div>
                                                <Button
                                                    onClick={() =>
                                                        handleSelectGuide(guide)
                                                    }
                                                    size="sm"
                                                >
                                                    <Plus /> Add
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {selectedGuides.length > 0 && (
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold">
                                            Selected Guides
                                        </h3>
                                        {selectedGuides.map((guide) => (
                                            <div
                                                key={guide.id}
                                                className="flex items-center justify-between p-2 border rounded bg-muted"
                                            >
                                                <div>
                                                    <p className="font-medium">
                                                        {guide.title}
                                                    </p>
                                                </div>
                                                <Button
                                                    onClick={() =>
                                                        handleRemoveGuide(guide)
                                                    }
                                                    size="sm"
                                                    variant="destructive"
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
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
