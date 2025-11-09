"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    BasicInfoForm,
    type BasicInfoFormData,
} from "@/components/learning/guide/basic-info-form";
import { PagesForm } from "@/components/learning/guide/pages-form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDictionary } from "@/hooks/use-dictionary";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";
import type {
    GuideResponse,
    UpdateGuideRequest,
} from "@/services/internal/learning/guides/controller/guide.response";
import { GuideStatus } from "@/services/internal/learning/guides/controller/guide.response";

export default function EditGuidePage() {
    const router = useRouter();
    const params = useParams();
    const PATHS = useLocalizedPaths();
    const dict = useDictionary() as any;
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

    const [guide, setGuide] = useState<GuideResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [activeTab, setActiveTab] = useState<string>("pages");

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
            } finally {
                setLoading(false);
            }
        };

        if (guideId) {
            loadGuide();
        }
    }, [guideId, router, PATHS, form]);

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

    if (loading) {
        return (
            <section className="flex flex-col h-full items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                    <p className="text-muted-foreground">
                        {dict?.admin?.guides?.editGuide?.loading}
                    </p>
                </div>
            </section>
        );
    }

    if (!guide) {
        return (
            <section className="flex flex-col h-full items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-muted-foreground">
                        {dict?.admin?.guides?.editGuide?.notFound}
                    </p>
                    <Button
                        onClick={() =>
                            router.push(
                                PATHS.DASHBOARD.ADMINISTRATION.GUIDES.ROOT,
                            )
                        }
                    >
                        {dict?.admin?.guides?.editGuide?.backToGuides}
                    </Button>
                </div>
            </section>
        );
    }

    return (
        <section className="flex flex-col h-full">
            {/* Header */}
            <div className="border-b bg-background">
                <div className="container max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">
                                {guide.title}
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
                                {guide.pagesCount})
                            </TabsTrigger>
                            <TabsTrigger
                                value="info"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                            >
                                {dict?.admin?.guides?.editGuide?.tabs?.info}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="pages" className="flex-1 mt-0">
                            <PagesForm
                                guideId={guideId}
                                initialPages={guide.pages.map((p) => ({
                                    id: p.id,
                                    content: p.content,
                                    orderNumber: p.orderNumber,
                                    isNew: false,
                                }))}
                                onFinish={handleFinish}
                            />
                        </TabsContent>

                        <TabsContent
                            value="info"
                            className="flex-1 mt-0 overflow-y-auto"
                        >
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
