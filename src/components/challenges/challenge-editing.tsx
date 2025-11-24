"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
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
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";
import type { GuideResponse } from "@/services/internal/learning/guides/controller/guide.response";

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
    maxAttemptsBeforeGuides: z
        .union([z.string(), z.number()])
        .transform(Number)
        .pipe(
            z
                .number()
                .min(2, "Max attempts before guides must be at least 2.")
                .max(5, "Max attempts before guides must be at most 5."),
        ),
});

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

    const [codeVersions, _setCodeVersions] =
        useState<CodeVersion[]>(initialCodeVersions);

    // Guides tab state
    const [searchTerm, setSearchTerm] = useState("");
    const [guides, setGuides] = useState<GuideResponse[]>([]);
    const [selectedGuideIds, setSelectedGuideIds] = useState<string[]>(
        challengeData.guides,
    );
    const [selectedGuidesMap, setSelectedGuidesMap] = useState<
        Map<string, GuideResponse>
    >(new Map());
    const [isSearching, setIsSearching] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const form = useForm({
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
            maxAttemptsBeforeGuides: Math.max(
                2,
                Math.min(5, challengeData.maxAttemptsBeforeGuides ?? 3),
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
            maxAttemptsBeforeGuides: Math.max(
                2,
                Math.min(5, challengeData.maxAttemptsBeforeGuides ?? 3),
            ),
        });
        setSelectedGuideIds(challengeData.guides);
    }, [challengeData, form]);

    // Load existing selected guides data
    useEffect(() => {
        const loadSelectedGuides = async () => {
            if (selectedGuideIds.length === 0) {
                setSelectedGuidesMap(new Map());
                return;
            }

            const guidesData = await Promise.all(
                selectedGuideIds.map(async (guideId) => {
                    try {
                        const guide =
                            await GuideController.getGuideById(guideId);
                        return guide;
                    } catch (error) {
                        console.error(`Error loading guide ${guideId}:`, error);
                        return null;
                    }
                }),
            );

            const newMap = new Map<string, GuideResponse>();
            guidesData.forEach((guide) => {
                if (guide) {
                    newMap.set(guide.id, guide);
                }
            });
            setSelectedGuidesMap(newMap);
        };

        loadSelectedGuides();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedGuideIds.length, selectedGuideIds.map]);

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

    const onSubmit = form.handleSubmit(async (data) => {
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
                    maxAttemptsBeforeGuides: data.maxAttemptsBeforeGuides,
                },
            );

            setChallengeData(updatedChallenge);

            if (editorMethods || editorRef.current) {
                (editorMethods ?? editorRef.current)?.injectMarkdown(
                    updatedChallenge.description || "",
                );
            }

            toast.success(
                dict?.challenges?.messages?.edit?.challengeUpdated ||
                    "Challenge updated successfully!",
            );
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

    const _handleDelete = async () => {};

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
                    console.error(
                        "[ChallengeEditing] Error searching guides:",
                        error,
                    );
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

    const handleSelectGuide = async (guide: GuideResponse) => {
        if (selectedGuideIds.includes(guide.id)) {
            toast.info(
                dict?.challenges?.messages?.edit?.guideAlreadySelected ||
                    "Guide already selected.",
            );
            return;
        }
        const success = await ChallengeController.addGuideToChallenge(
            challengeId,
            guide.id,
        );
        if (success) {
            setSelectedGuideIds((prev) => [...prev, guide.id]);
            setSelectedGuidesMap((prev) => new Map(prev).set(guide.id, guide));
            toast.success(
                dict?.challenges?.messages?.edit?.guideAdded ||
                    "Guide added to challenge successfully!",
            );
        } else {
            toast.error(
                dict?.challenges?.messages?.edit?.guideAddFailed ||
                    "Failed to add guide to challenge.",
            );
        }
    };

    const handleRemoveGuide = async (guideId: string) => {
        const success = await ChallengeController.removeGuideFromChallenge(
            challengeId,
            guideId,
        );
        if (success) {
            setSelectedGuideIds((prev) => prev.filter((id) => id !== guideId));
            setSelectedGuidesMap((prev) => {
                const newMap = new Map(prev);
                newMap.delete(guideId);
                return newMap;
            });
            toast.success(
                dict?.challenges?.messages?.edit?.guideRemoved ||
                    "Guide removed from challenge successfully!",
            );
        } else {
            toast.error(
                dict?.challenges?.messages?.edit?.guideRemoveFailed ||
                    "Failed to remove guide from challenge.",
            );
        }
    };

    return (
        <section className="h-screen flex flex-col p-4 container mx-auto">
            {/* Header */}
            <header className="shrink-0 p-6 border-b flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">
                        {dict?.challenges?.messages?.edit?.title ||
                            "Edit Challenge"}
                    </h1>
                    <p className="text-muted-foreground">
                        {dict?.challenges?.messages?.edit?.description ||
                            "Update the challenge details and description."}
                    </p>
                </div>
                <div className="flex gap-4">
                    <DeleteChallengeButton challengeId={challengeId} />
                    <Button onClick={handleAddVersion}>
                        {dict?.challenges?.messages?.edit?.addCodeVersion ||
                            "Add Code Version"}
                    </Button>
                    <Button variant="outline" onClick={handleViewSummary}>
                        {dict?.challenges?.messages?.edit?.viewSummary ||
                            "View Summary"}
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
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="basic">
                                        {dict?.challenges?.messages?.edit
                                            ?.basicInformation ||
                                            "Basic Information"}
                                    </TabsTrigger>
                                    <TabsTrigger value="languages">
                                        {dict?.challenges?.messages?.edit
                                            ?.availableLanguages ||
                                            "Available Languages"}
                                    </TabsTrigger>
                                    <TabsTrigger value="guides">
                                        {dict?.challenges?.messages?.edit
                                            ?.guides || "Guides"}
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
                                                        {dict?.challenges
                                                            ?.messages?.edit
                                                            ?.challengeTitle ||
                                                            "Challenge Title"}
                                                    </FieldLabel>
                                                    <Input
                                                        {...field}
                                                        id={field.name}
                                                        aria-invalid={
                                                            fieldState.invalid
                                                        }
                                                        placeholder={
                                                            dict?.challenges
                                                                ?.messages?.edit
                                                                ?.enterChallengeTitle ||
                                                            "Enter challenge title"
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
                                                        {dict?.challenges
                                                            ?.messages?.edit
                                                            ?.tagsCommaSeparated ||
                                                            "Tags (comma separated)"}
                                                    </FieldLabel>
                                                    <Input
                                                        {...field}
                                                        id={field.name}
                                                        aria-invalid={
                                                            fieldState.invalid
                                                        }
                                                        placeholder={
                                                            dict?.challenges
                                                                ?.messages?.edit
                                                                ?.tagsPlaceholder ||
                                                            "e.g., JavaScript, React, Node.js"
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
                                                        {dict?.challenges
                                                            ?.messages?.edit
                                                            ?.difficultyLevel ||
                                                            "Difficulty Level"}
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
                                                                        ?.challenges
                                                                        ?.edit
                                                                        ?.selectDifficulty ||
                                                                    "Select difficulty"
                                                                }
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem
                                                                value={
                                                                    ChallengeDifficulty.EASY
                                                                }
                                                            >
                                                                {dict
                                                                    ?.challenges
                                                                    ?.difficulties
                                                                    ?.easy ||
                                                                    "Easy"}
                                                            </SelectItem>
                                                            <SelectItem
                                                                value={
                                                                    ChallengeDifficulty.MEDIUM
                                                                }
                                                            >
                                                                {dict
                                                                    ?.challenges
                                                                    ?.difficulties
                                                                    ?.medium ||
                                                                    "Medium"}
                                                            </SelectItem>
                                                            <SelectItem
                                                                value={
                                                                    ChallengeDifficulty.HARD
                                                                }
                                                            >
                                                                {dict
                                                                    ?.challenges
                                                                    ?.difficulties
                                                                    ?.hard ||
                                                                    "Hard"}
                                                            </SelectItem>
                                                            <SelectItem
                                                                value={
                                                                    ChallengeDifficulty.EXPERT
                                                                }
                                                            >
                                                                {dict
                                                                    ?.challenges
                                                                    ?.difficulties
                                                                    ?.expert ||
                                                                    "Expert"}
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
                                                        {dict?.challenges
                                                            ?.messages?.edit
                                                            ?.experiencePoints ||
                                                            "Experience Points"}
                                                    </FieldLabel>
                                                    <FieldDescription>
                                                        {dict?.challenges?.messages?.edit?.experiencePointsDescription
                                                            ?.replace(
                                                                "{difficulty}",
                                                                difficulty,
                                                            )
                                                            .replace(
                                                                "{maxXP}",
                                                                maxExperiencePoints.toString(),
                                                            ) ||
                                                            `${difficulty} challenges can award up to ${maxExperiencePoints} XP. Move the slider to adjust the reward.`}
                                                    </FieldDescription>
                                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                        <span className="font-semibold text-foreground">
                                                            {field.value ?? 0}{" "}
                                                            {dict?.challenges
                                                                ?.messages?.edit
                                                                ?.xp || "XP"}
                                                        </span>
                                                        <span>
                                                            {dict?.challenges?.messages?.edit?.maxXP?.replace(
                                                                "{maxXP}",
                                                                maxExperiencePoints.toString(),
                                                            ) ||
                                                                `Max ${maxExperiencePoints} XP`}
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
                                                    ? dict?.challenges?.messages
                                                          ?.edit?.saving ||
                                                      "Saving..."
                                                    : dict?.challenges?.messages
                                                          ?.edit?.saveChanges ||
                                                      "Save Changes"}
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
                                <TabsContent
                                    value="guides"
                                    className="space-y-6 mt-6"
                                >
                                    <Controller
                                        name="maxAttemptsBeforeGuides"
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
                                                    {dict?.challenges?.messages
                                                        ?.edit
                                                        ?.maxAttemptsBeforeGuides ||
                                                        "Max Attempts Before Guides"}
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
                                                    {dict?.challenges?.messages
                                                        ?.edit
                                                        ?.maxAttemptsBeforeGuidesDescription ||
                                                        "Number of attempts allowed before guides become available."}
                                                </FieldDescription>
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
                                    <Field>
                                        <FieldLabel>
                                            {dict?.challenges?.messages?.edit
                                                ?.searchGuides ||
                                                "Search Guides"}
                                        </FieldLabel>
                                        <Input
                                            placeholder={
                                                dict?.challenges?.messages?.edit
                                                    ?.searchGuidesPlaceholder ||
                                                "Search guides by title..."
                                            }
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                        />
                                        <FieldDescription>
                                            {dict?.challenges?.messages?.edit
                                                ?.searchGuidesDescription ||
                                                "Type to search for guides. Results will appear below."}
                                        </FieldDescription>
                                    </Field>
                                    {isSearching && (
                                        <p>
                                            {dict?.challenges?.messages?.edit
                                                ?.searching || "Searching..."}
                                        </p>
                                    )}
                                    {guides.length > 0 && (
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-semibold">
                                                {dict?.challenges?.messages
                                                    ?.edit?.searchResults ||
                                                    "Search Results"}
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
                                                            handleSelectGuide(
                                                                guide,
                                                            )
                                                        }
                                                        size="sm"
                                                    >
                                                        {dict?.challenges
                                                            ?.messages?.edit
                                                            ?.add || "+"}
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {selectedGuideIds.length > 0 && (
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-semibold">
                                                {dict?.challenges?.messages
                                                    ?.edit?.selectedGuides ||
                                                    "Selected Guides"}
                                            </h3>
                                            {selectedGuideIds.map((guideId) => {
                                                const guide =
                                                    selectedGuidesMap.get(
                                                        guideId,
                                                    );
                                                return (
                                                    <div
                                                        key={guideId}
                                                        className="flex items-center justify-between p-3 border rounded bg-muted/50 hover:bg-muted transition-colors"
                                                    >
                                                        <div className="flex-1">
                                                            <p className="font-medium text-foreground">
                                                                {guide?.title ||
                                                                    guideId}
                                                            </p>
                                                            {guide?.description && (
                                                                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                                                    {
                                                                        guide.description
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                        <Button
                                                            onClick={() =>
                                                                handleRemoveGuide(
                                                                    guideId,
                                                                )
                                                            }
                                                            size="icon"
                                                            variant="ghost"
                                                            className="ml-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                            aria-label={
                                                                dict?.challenges
                                                                    ?.messages
                                                                    ?.edit
                                                                    ?.removeGuide ||
                                                                "Remove guide"
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
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
