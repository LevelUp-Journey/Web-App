"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    BasicInfoForm,
    type BasicInfoFormData,
} from "@/components/learning/guide/basic-info-form";
import { ChallengesForm } from "@/components/learning/guide/challenges-form";
import { PagesForm } from "@/components/learning/guide/pages-form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDictionary } from "@/hooks/use-dictionary";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import { ChallengeController } from "@/services/internal/challenges/challenge/controller/challenge.controller";
import { CodeVersionController } from "@/services/internal/challenges/challenge/controller/code-version.controller";
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";
import type {
    GuideResponse,
    UpdateGuideRequest,
} from "@/services/internal/learning/guides/controller/guide.response";
import { GuideStatus } from "@/services/internal/learning/guides/controller/guide.response";

export default function EditGuidePage() {
    const router = useRouter();
    const params = useParams();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const PATHS = useLocalizedPaths();
    const dict = useDictionary();
    const guideId = params.guideId as string;

    const formSchema = z.object({
        title: z
            .string()
            .min(
                1,
                dict?.admin?.guides?.editGuide?.validation?.titleRequired ||
                    "Title is required",
            ),
        description: z
            .string()
            .min(
                10,
                dict?.admin?.guides?.editGuide?.validation?.descriptionMin ||
                    "Description must be at least 10 characters",
            )
            .max(
                1000,
                dict?.admin?.guides?.editGuide?.validation?.descriptionMax ||
                    "Description must not exceed 1000 characters",
            ),
        cover: z.string().optional(),
        topicIds: z
            .array(z.string())
            .min(
                1,
                dict?.admin?.guides?.editGuide?.validation?.topicsRequired ||
                    "At least one topic is required",
            ),
    });

    type FormData = z.infer<typeof formSchema>;

    const validTabs = ["pages", "challenges", "info"];
    const initialTab = searchParams.get("tab");
    const [guide, setGuide] = useState<GuideResponse | null>(null);
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [activeTab, setActiveTab] = useState<string>(
        initialTab && validTabs.includes(initialTab) ? initialTab : "pages",
    );
    const [relatedChallenges, setRelatedChallenges] = useState<
        { id: string; name: string; language: string }[]
    >([]);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            cover: "",
            topicIds: [],
        },
    });

    useEffect(() => {
        const loadGuide = async () => {
            try {
                const response = await GuideController.getGuideById(guideId);

                if (response) {
                    setGuide(response);

                    // Set form values
                    form.reset({
                        title: response.title,
                        description: response.description,
                        cover: response.coverImage || "",
                        topicIds: response.topics.map((t) => t.id),
                    });

                    // Fetch related challenges
                    try {
                        if (
                            response.relatedChallenges &&
                            response.relatedChallenges.length > 0
                        ) {
                            const challenges = [];
                            for (const challengeId of response.relatedChallenges) {
                                const challenge =
                                    await ChallengeController.getChallengeById(
                                        challengeId,
                                    );
                                if (challenge) {
                                    const codeVersions =
                                        await CodeVersionController.getCodeVersionsByChallengeId(
                                            challengeId,
                                        );
                                    const language =
                                        codeVersions.length > 0
                                            ? codeVersions[0].language
                                            : "Unknown";
                                    challenges.push({
                                        id: challenge.id,
                                        name: challenge.name,
                                        language,
                                    });
                                }
                            }
                            setRelatedChallenges(challenges);
                        }
                    } catch (error) {
                        console.error(
                            "Error fetching related challenges:",
                            error,
                        );
                        setRelatedChallenges([]);
                    }
                } else {
                    alert(
                        dict?.admin?.guides?.editGuide?.notFound ||
                            "Guide not found. Please try again.",
                    );
                    router.push(PATHS.DASHBOARD.ADMINISTRATION.GUIDES.ROOT);
                }
            } catch (error) {
                console.error("Error loading guide:", error);
                alert(
                    dict?.admin?.guides?.editGuide?.basicInfo?.updateError ||
                        "Error loading guide. Please try again.",
                );
                router.push(PATHS.DASHBOARD.ADMINISTRATION.GUIDES.ROOT);
            }
        };

        if (guideId) {
            loadGuide();
        }
    }, [guideId, router, PATHS, form]);

    // Sync URL with activeTab
    useEffect(() => {
        const currentTab = searchParams.get("tab");
        if (currentTab !== activeTab) {
            const newSearchParams = new URLSearchParams(searchParams);
            if (
                activeTab === "pages" &&
                !validTabs.includes(currentTab || "")
            ) {
                newSearchParams.delete("tab");
            } else {
                newSearchParams.set("tab", activeTab);
            }
            router.replace(`${pathname}?${newSearchParams.toString()}`, {
                scroll: false,
            });
        }
    }, [activeTab, searchParams, router, pathname, validTabs]);

    const handleUpdateBasicInfo = async (data: BasicInfoFormData) => {
        setSaving(true);
        try {
            const request: UpdateGuideRequest = {
                title: data.title,
                description: data.description,
                coverImage: data.cover || "",
                topicIds: data.topicIds,
            };

            const response = await GuideController.updateGuide(
                guideId,
                request,
            );
            setGuide(response);
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
    };

    const handleFinish = () => {
        router.push(PATHS.DASHBOARD.ADMINISTRATION.GUIDES.ROOT);
    };

    const handleCancel = () => {
        if (
            confirm(
                dict?.admin?.guides?.editGuide?.basicInfo?.cancelConfirm ||
                    "Are you sure you want to cancel? Any unsaved changes will be lost.",
            )
        ) {
            router.push(PATHS.DASHBOARD.ADMINISTRATION.GUIDES.ROOT);
        }
    };

    const handlePublish = async () => {
        if (!guide) return;

        setPublishing(true);
        try {
            const updatedGuide = await GuideController.updateGuideStatus(
                guide.id,
                {
                    status: GuideStatus.PUBLISHED,
                },
            );
            setGuide(updatedGuide);
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
    };

    return (
        <section className="flex flex-col h-full">
            {/* Header */}
            <div className="border-b bg-background">
                <div className="container max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">
                                {guide?.title || "Loading..."}
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                {dict?.admin?.guides?.editGuide?.subtitle}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="default"
                                onClick={handlePublish}
                                disabled={
                                    publishing ||
                                    !guide ||
                                    guide?.status === GuideStatus.PUBLISHED
                                }
                            >
                                {publishing
                                    ? dict?.admin?.guides?.editGuide?.publishing
                                    : dict?.admin?.guides?.editGuide?.publish}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() =>
                                    router.push(
                                        PATHS.DASHBOARD.ADMINISTRATION.GUIDES
                                            .ROOT,
                                    )
                                }
                            >
                                {dict?.admin?.guides?.editGuide?.backToGuides}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                <div className="container max-w-6xl mx-auto h-full">
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="h-full flex flex-col"
                    >
                        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                            <TabsTrigger
                                value="pages"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                            >
                                {dict?.admin?.guides?.editGuide?.tabs?.pages} (
                                {guide?.pagesCount || 0})
                            </TabsTrigger>
                            <TabsTrigger
                                value="challenges"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                            >
                                Challenges ({relatedChallenges.length})
                            </TabsTrigger>
                            <TabsTrigger
                                value="info"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                            >
                                {dict?.admin?.guides?.editGuide?.tabs?.info}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent
                            value="pages"
                            className="flex-1 mt-0 overflow-y-auto"
                        >
                            <div
                                tabIndex={-1}
                                style={{
                                    position: "absolute",
                                    left: "-9999px",
                                }}
                            ></div>
                            <PagesForm
                                guideId={guideId}
                                initialPages={
                                    guide?.pages?.map((p) => ({
                                        id: p.id,
                                        content: p.content,
                                        orderNumber: p.orderNumber,
                                        isNew: false,
                                    })) || []
                                }
                                onFinish={handleFinish}
                            />
                        </TabsContent>

                        <TabsContent
                            value="challenges"
                            className="flex-1 mt-0 overflow-y-auto"
                        >
                            <div
                                tabIndex={-1}
                                style={{
                                    position: "absolute",
                                    left: "-9999px",
                                }}
                            ></div>
                            <ChallengesForm
                                guideId={guideId}
                                initialChallenges={relatedChallenges}
                                onFinish={handleFinish}
                                onGuideUpdate={setGuide}
                            />
                        </TabsContent>

                        <TabsContent
                            value="info"
                            className="flex-1 mt-0 overflow-y-auto"
                        >
                            <div
                                tabIndex={-1}
                                style={{
                                    position: "absolute",
                                    left: "-9999px",
                                }}
                            ></div>
                            <div className="max-w-3xl mx-auto p-6">
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold">
                                        {
                                            dict?.admin?.guides?.editGuide
                                                ?.basicInfo?.title
                                        }
                                    </h2>
                                    <p className="text-muted-foreground mt-1">
                                        {
                                            dict?.admin?.guides?.editGuide
                                                ?.basicInfo?.subtitle
                                        }
                                    </p>
                                </div>
                                <BasicInfoForm
                                    form={form}
                                    onSubmit={handleUpdateBasicInfo}
                                    onCancel={handleCancel}
                                    isSubmitting={saving}
                                    submitButtonText={
                                        dict?.admin?.guides?.editGuide
                                            ?.basicInfo?.update
                                    }
                                    submitButtonLoadingText={
                                        dict?.admin?.guides?.editGuide
                                            ?.basicInfo?.updating
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
