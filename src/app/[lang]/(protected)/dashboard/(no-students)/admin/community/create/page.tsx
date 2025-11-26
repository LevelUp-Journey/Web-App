"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDictionary } from "@/hooks/use-dictionary";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import type { CreateCommunityRequest } from "@/services/internal/community/server/community.actions";
import { CommunityForm, type CommunityFormData } from "@/components/community/community-form";

export default function CreateCommunityPage() {
    const router = useRouter();
    const PATHS = useLocalizedPaths();
    const dict = useDictionary();
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (data: CommunityFormData) => {
        setSaving(true);
        try {
            const request: CreateCommunityRequest = {
                name: data.name.trim(),
                description: data.description.trim(),
                iconUrl: data.iconUrl || undefined,
                bannerUrl: data.bannerUrl || undefined,
                isPrivate: data.isPrivate,
            };

            const response = await CommunityController.createCommunity(request);

            if (response) {
                router.push(PATHS.DASHBOARD.ADMINISTRATION.COMMUNITY.ROOT);
            } else {
                alert(
                    dict?.admin.community.createForm?.errorCreating ||
                        "Error creating community. Please try again.",
                );
            }
        } catch (error) {
            console.error("Error creating community:", error);
            alert(
                dict?.admin.community.createForm?.errorCreating ||
                    "Error creating community. Please try again.",
            );
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        router.push(PATHS.DASHBOARD.ADMINISTRATION.COMMUNITY.ROOT);
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
            <div className="w-full max-w-md bg-card rounded-lg shadow-lg p-8">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold">
                        {dict?.admin.community.createForm?.title ||
                            "Customize Your Community"}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        {dict?.admin.community.createForm?.subtitle ||
                            "Give your new community a personality with a name and an icon. You can always change it later."}
                    </p>
                </div>

                <CommunityForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isSubmitting={saving}
                    submitButtonText={dict?.admin.community.createForm?.submitButton || "Create"}
                />
            </div>
        </div>
    );
}
