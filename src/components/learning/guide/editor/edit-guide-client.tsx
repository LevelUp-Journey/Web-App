"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    BasicInfoForm,
    type BasicInfoFormData,
} from "@/components/learning/guide/basic-info-form";
import { ChallengesForm } from "@/components/learning/guide/challenges-form";
import { GuidePagesManager } from "@/components/learning/guide/editor/guide-pages-manager";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDictionary } from "@/hooks/use-dictionary";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import type { Dictionary } from "@/lib/i18n";
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";
import {
    GuideStatus,
    type GuideResponse,
} from "@/services/internal/learning/guides/controller/guide.response";
import {
    type GuideEditorChallengeSummary,
    useGuideEditorStore,
} from "@/stores/guide-editor-store";

interface EditGuideClientProps {
    guide: GuideResponse;
    challenges: GuideEditorChallengeSummary[];
    initialTab?: string;
}

const VALID_TABS = ["pages", "challenges", "info"] as const;
const DEFAULT_TAB = "pages";

type ValidTab = (typeof VALID_TABS)[number];

function isValidTab(tab: string | undefined | null): tab is ValidTab {
    return tab != null && VALID_TABS.includes(tab as ValidTab);
}

function mapChallenges(
    challengesFromStore: GuideEditorChallengeSummary[],
    fallback: GuideEditorChallengeSummary[],
): GuideEditorChallengeSummary[] {
    return challengesFromStore.length ? challengesFromStore : fallback;
}

export function EditGuideClient({
    guide,
    challenges,
    initialTab,
}: EditGuideClientProps) {
    const dict = useDictionary();
    const PATHS = useLocalizedPaths();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const normalizedInitialTab = isValidTab(initialTab) ? initialTab : DEFAULT_TAB;
    const [activeTab, setActiveTab] = useState<ValidTab>(normalizedInitialTab);

    const initialize = useGuideEditorStore((state) => state.initialize);
    const resetStore = useGuideEditorStore((state) => state.reset);
    const guideFromStore = useGuideEditorStore((state) => state.guide);
    const relatedChallenges = useGuideEditorStore(
        (state) => state.relatedChallenges,
    );
    const isSaving = useGuideEditorStore((state) => state.isSaving);
    const isPublishing = useGuideEditorStore((state) => state.isPublishing);
    const setSaving = useGuideEditorStore((state) => state.setSaving);
    const setPublishing = useGuideEditorStore((state) => state.setPublishing);
    const applyGuideResponse = useGuideEditorStore(
        (state) => state.applyGuideResponse,
    );

    const formSchema = useMemo(
        () =>
            z.object({
                title: z
                    .string()
                    .min(
                        1,
                        dict?.admin?.guides?.editGuide?.validation
                            ?.titleRequired || "Title is required",
                    ),
                description: z
                    .string()
                    .min(
                        10,
                        dict?.admin?.guides?.editGuide?.validation
                            ?.descriptionMin ||
                            "Description must be at least 10 characters",
                    )
                    .max(
                        1000,
                        dict?.admin?.guides?.editGuide?.validation
                            ?.descriptionMax ||
                            "Description must not exceed 1000 characters",
                    ),
                cover: z.string().optional(),
                topicIds: z
                    .array(z.string())
                    .min(
                        1,
                        dict?.admin?.guides?.editGuide?.validation
                            ?.topicsRequired ||
                            "At least one topic is required",
                    ),
            }),
        [dict],
    );

    const form = useForm<BasicInfoFormData, any, BasicInfoFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: guide.title,
            description: guide.description,
            cover: guide.coverImage || "",
            topicIds: guide.topics.map((topic) => topic.id),
        },
    });

    useEffect(() => {
        initialize(guide, challenges);
        return () => {
            resetStore();
        };
    }, [initialize, resetStore, guide, challenges]);

    useEffect(() => {
        if (guideFromStore) {
            form.reset({
                title: guideFromStore.title,
                description: guideFromStore.description,
                cover: guideFromStore.coverImage || "",
                topicIds: guideFromStore.topics.map((topic) => topic.id),
            });
        }
    }, [guideFromStore, form]);

    useEffect(() => {
        const currentFromQuery = searchParams.get("tab");
        if (isValidTab(currentFromQuery) && currentFromQuery !== activeTab) {
            setActiveTab(currentFromQuery);
        }
    }, [searchParams, activeTab]);

    useEffect(() => {
        const currentTab = searchParams.get("tab");
        if (currentTab === activeTab || (!currentTab && activeTab === DEFAULT_TAB)) {
            return;
        }

        const params = new URLSearchParams(searchParams.toString());
        if (activeTab === DEFAULT_TAB) {
            params.delete("tab");
        } else {
            params.set("tab", activeTab);
        }

        router.replace(
            params.size ? `${pathname}?${params.toString()}` : pathname,
            { scroll: false },
        );
    }, [activeTab, pathname, router, searchParams]);

    const currentGuide = guideFromStore ?? guide;
    const challengeList = mapChallenges(relatedChallenges, challenges);

    const handleGuideUpdate = useCallback(
        (updatedGuide: GuideResponse | null | undefined) => {
            if (!updatedGuide) {
                return;
            }
            applyGuideResponse(updatedGuide);
        },
        [applyGuideResponse],
    );

    const handleUpdateBasicInfo = useCallback(
        async (data: BasicInfoFormData) => {
            const guideId = currentGuide?.id;
            if (!guideId) {
                return;
            }

            setSaving(true);
            try {
                const response = await GuideController.updateGuide(guideId, {
                    title: data.title,
                    description: data.description,
                    coverImage: data.cover || "",
                    topicIds: data.topicIds,
                });

                applyGuideResponse(response);
                alert(
                    dict?.admin?.guides?.editGuide?.basicInfo?.updateSuccess ||
                        "Guide updated successfully!",
                );
            } catch (error) {
                console.error("Error updating guide:", error);
                alert(
                    dict?.admin?.guides?.editGuide?.basicInfo?.updateError ||
                        "Error updating guide. Please try again.",
                );
            } finally {
                setSaving(false);
            }
        },
        [applyGuideResponse, currentGuide?.id, dict, setSaving],
    );

    const handleCancel = useCallback(() => {
        const confirmation = confirm(
            dict?.admin?.guides?.editGuide?.basicInfo?.cancelConfirm ||
                "Are you sure you want to cancel? Any unsaved changes will be lost.",
        );

        if (confirmation) {
            router.push(PATHS.DASHBOARD.ADMINISTRATION.GUIDES.ROOT);
        }
    }, [PATHS.DASHBOARD.ADMINISTRATION.GUIDES.ROOT, dict, router]);

    const handleFinish = useCallback(() => {
        router.push(PATHS.DASHBOARD.ADMINISTRATION.GUIDES.ROOT);
    }, [PATHS.DASHBOARD.ADMINISTRATION.GUIDES.ROOT, router]);

    const handlePublish = useCallback(async () => {
        const guideId = currentGuide?.id;
        if (!guideId) {
            return;
        }

        setPublishing(true);
        try {
            const updatedGuide = await GuideController.updateGuideStatus(
                guideId,
                { status: GuideStatus.PUBLISHED },
            );
            applyGuideResponse(updatedGuide);
            router.push(PATHS.DASHBOARD.ADMINISTRATION.GUIDES.ROOT);
        } catch (error) {
            console.error("Error publishing guide:", error);
            alert(
                dict?.admin?.guides?.editGuide?.basicInfo?.publishError ||
                    "Error publishing guide. Please try again.",
            );
        } finally {
            setPublishing(false);
        }
    }, [PATHS.DASHBOARD.ADMINISTRATION.GUIDES.ROOT, applyGuideResponse, currentGuide?.id, dict, router, setPublishing]);

    return (
        <section className="flex h-full flex-col">
            <div className="border-b bg-background">
                <div className="container mx-auto max-w-6xl px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">
                                {currentGuide?.title || "Loading..."}
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {dict?.admin?.guides?.editGuide?.subtitle}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="default"
                                onClick={handlePublish}
                                disabled={
                                    isPublishing ||
                                    !currentGuide ||
                                    currentGuide.status === GuideStatus.PUBLISHED
                                }
                            >
                                {isPublishing
                                    ? dict?.admin?.guides?.editGuide?.publishing
                                    : dict?.admin?.guides?.editGuide?.publish}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() =>
                                    router.push(
                                        PATHS.DASHBOARD.ADMINISTRATION.GUIDES.ROOT,
                                    )
                                }
                            >
                                {dict?.admin?.guides?.editGuide?.backToGuides}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <div className="container mx-auto h-full max-w-6xl">
                    <Tabs
                        value={activeTab}
                        onValueChange={(value) => setActiveTab(value as ValidTab)}
                        className="flex h-full flex-col"
                    >
                        <TabsList className="h-auto w-full justify-start rounded-none border-b bg-transparent p-0">
                            <TabsTrigger
                                value="pages"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                            >
                                {dict?.admin?.guides?.editGuide?.tabs?.pages} (
                                {currentGuide?.pagesCount ?? 0})
                            </TabsTrigger>
                            <TabsTrigger
                                value="challenges"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                            >
                                {dict?.admin?.guides?.editGuide?.tabs?.challenges ||
                                    "Challenges"} ({challengeList.length})
                            </TabsTrigger>
                            <TabsTrigger
                                value="info"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                            >
                                {dict?.admin?.guides?.editGuide?.tabs?.info}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="pages" className="mt-0 flex-1 overflow-hidden">
                            <div className="flex h-full flex-col">
                                <div className="flex-1 overflow-hidden">
                                    <GuidePagesManager guideId={guide.id} />
                                </div>
                                <div className="flex justify-end border-t px-4 py-3">
                                    <Button variant="outline" onClick={handleFinish}>
                                        {dict?.admin?.guides?.editGuide?.pages?.done ||
                                            "Done"}
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="challenges" className="mt-0 flex-1 overflow-hidden">
                            <div className="flex h-full flex-col">
                                <div className="flex-1 overflow-hidden">
                                    <ChallengesForm
                                        guideId={guide.id}
                                        initialChallenges={challengeList}
                                        onFinish={handleFinish}
                                        onGuideUpdate={handleGuideUpdate}
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="info" className="mt-0 flex-1 overflow-y-auto">
                            <div className="mx-auto max-w-3xl p-6">
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold">
                                        {dict?.admin?.guides?.editGuide?.basicInfo?.title}
                                    </h2>
                                    <p className="mt-1 text-muted-foreground">
                                        {dict?.admin?.guides?.editGuide?.basicInfo?.subtitle}
                                    </p>
                                </div>
                                <BasicInfoForm
                                    form={form}
                                    onSubmit={handleUpdateBasicInfo}
                                    onCancel={handleCancel}
                                    isSubmitting={isSaving}
                                    submitButtonText={
                                        dict?.admin?.guides?.editGuide?.basicInfo?.update
                                    }
                                    submitButtonLoadingText={
                                        dict?.admin?.guides?.editGuide?.basicInfo?.updating
                                    }
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </section>
    );
}
