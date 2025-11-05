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

export default function CreateGuidePage() {
    const router = useRouter();
    const PATHS = useLocalizedPaths();
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

            // Redirect to edit page where user can add pages
            router.push(
                `${PATHS.DASHBOARD.ADMINISTRATION.GUIDES.ROOT}/${response.id}/edit`,
            );
        } catch (error) {
            console.error("Error creating guide:", error);
            alert("Error creating guide. Please try again.");
        } finally {
            setSaving(false);
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

    return (
        <section className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
                <div className="container max-w-3xl mx-auto p-6">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold">
                            Create a New Guide
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Provide basic information about your guide. You can
                            add pages after creation.
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
