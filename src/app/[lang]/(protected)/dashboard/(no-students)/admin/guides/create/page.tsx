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
import { useDictionary } from "@/hooks/use-dictionary";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";
import type { CreateGuideRequest } from "@/services/internal/learning/guides/controller/guide.response";

export default function CreateGuidePage() {
    const router = useRouter();
    const PATHS = useLocalizedPaths();
    const dict = useDictionary();
    const [saving, setSaving] = useState(false);

    const formSchema = z.object({
        title: z
            .string()
            .min(
                1,
                dict?.admin.guides.createGuide.validation?.titleRequired ||
                    "Title is required",
            ),
        description: z
            .string()
            .min(
                10,
                dict?.admin.guides.createGuide.validation?.descriptionMin ||
                    "Description must be at least 10 characters",
            )
            .max(
                1000,
                dict?.admin.guides.createGuide.validation?.descriptionMax ||
                    "Description must not exceed 1000 characters",
            ),
        cover: z.string().optional(),
        topicIds: z
            .array(z.string())
            .min(
                1,
                dict?.admin.guides.createGuide.validation?.topicsRequired ||
                    "At least one topic is required",
            ),
    });

    type FormData = z.infer<typeof formSchema>;

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

            if (response) {
                // Redirect to edit page where user can add pages
                router.push(
                    `${PATHS.DASHBOARD.ADMINISTRATION.GUIDES.ROOT}/${response.id}/edit`,
                );
            } else {
                alert(
                    dict?.admin.guides.createGuide.errorCreating ||
                        "Error creating guide. Please try again.",
                );
            }
        } catch (error) {
            console.error("Error creating guide:", error);
            alert(
                dict?.admin.guides.createGuide.errorCreating ||
                    "Error creating guide. Please try again.",
            );
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (
            confirm(
                dict?.admin.guides.createGuide.cancelConfirm ||
                    "Are you sure you want to cancel? All progress will be lost.",
            )
        ) {
            router.push(PATHS.DASHBOARD.ADMINISTRATION.GUIDES.ROOT);
        }
    };

    return (
        <section className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
                <div className="container max-w-3xl mx-auto p-6">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold">
                            {dict?.admin.guides.createGuide.title}
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            {dict?.admin.guides.createGuide.subtitle}
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
        </section>
    );
}
