"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    BasicInfoForm,
    type BasicInfoFormData,
} from "@/components/learning/guide/basic-info-form";
import { PagesForm } from "@/components/learning/guide/pages-form";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";
import type { CreateGuideRequest } from "@/services/internal/learning/guides/controller/guide.response";

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(1000, "Description must not exceed 1000 characters"),
    cover: z.string().optional(),
    topicIds: z.array(z.string()).min(1, "At least one topic is required"),
});

type FormData = z.infer<typeof formSchema>;

type Step = "basic-info" | "pages";

export default function CreateGuidePage() {
    const router = useRouter();
    const PATHS = useLocalizedPaths();
    const [currentStep, setCurrentStep] = useState<Step>("basic-info");
    const [createdGuideId, setCreatedGuideId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            cover: "",
            topicIds: [],
        },
    });

    const handleBasicInfoSubmit = async (data: BasicInfoFormData) => {
        setSaving(true);
        try {
            const userId = await AuthController.getUserId();

            const request: CreateGuideRequest = {
                title: data.title,
                description: data.description,
                coverImage: data.cover || "",
                authorIds: [userId],
                topicIds: data.topicIds,
            };

            const response = await GuideController.createGuide(request);

            setCreatedGuideId(response.id);
            setCurrentStep("pages");
        } catch (error) {
            console.error("Error creating guide:", error);
            alert("Error creating guide. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleFinish = async () => {
        if (!createdGuideId) return;

        try {
            // Optionally update guide status to PUBLISHED here
            // await GuideController.updateGuideStatus(createdGuideId, {
            //     status: GuideStatus.PUBLISHED,
            // });

            router.push(PATHS.DASHBOARD.ADMINISTRATION.GUIDES.ROOT);
        } catch (error) {
            console.error("Error finishing guide creation:", error);
            alert("Error finishing guide creation. Please try again.");
        }
    };

    const handleCancel = () => {
        if (
            confirm(
                "Are you sure you want to cancel? All progress will be lost.",
            )
        ) {
            router.push(PATHS.DASHBOARD.ADMINISTRATION.GUIDES.ROOT);
        }
    };

    const handleBackToBasicInfo = () => {
        if (
            confirm(
                "Going back will keep the guide but you'll need to save any page changes. Continue?",
            )
        ) {
            setCurrentStep("basic-info");
        }
    };

    return (
        <section className="flex flex-col h-full">
            {/* Progress Indicator */}
            <div className="border-b bg-background">
                <div className="container max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-center gap-4">
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                    currentStep === "basic-info"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-primary/20 text-primary"
                                }`}
                            >
                                1
                            </div>
                            <span
                                className={`text-sm font-medium ${
                                    currentStep === "basic-info"
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                }`}
                            >
                                Basic Information
                            </span>
                        </div>
                        <div className="h-px w-12 bg-border" />
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                    currentStep === "pages"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                }`}
                            >
                                2
                            </div>
                            <span
                                className={`text-sm font-medium ${
                                    currentStep === "pages"
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                }`}
                            >
                                Add Pages
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                {currentStep === "basic-info" ? (
                    <div className="h-full overflow-y-auto">
                        <div className="container max-w-3xl mx-auto p-6">
                            <div className="mb-6">
                                <h1 className="text-3xl font-bold">
                                    Create a New Guide
                                </h1>
                                <p className="text-muted-foreground mt-2">
                                    Start by providing basic information about
                                    your guide.
                                </p>
                            </div>
                            <BasicInfoForm
                                form={form}
                                onSubmit={handleBasicInfoSubmit}
                                onCancel={handleCancel}
                                isSubmitting={saving}
                            />
                        </div>
                    </div>
                ) : currentStep === "pages" && createdGuideId ? (
                    <PagesForm
                        guideId={createdGuideId}
                        onFinish={handleFinish}
                        onBack={handleBackToBasicInfo}
                    />
                ) : null}
            </div>
        </section>
    );
}
