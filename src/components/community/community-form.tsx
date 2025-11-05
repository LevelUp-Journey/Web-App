"use client";

import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import type { Community } from "@/services/internal/community/entities/community.entity";
import type {
    CreateCommunityRequest,
    UpdateCommunityRequest,
} from "@/services/internal/community/server/community.actions";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";

interface CommunityFormProps {
    communityId?: string;
    initialData?: Community;
    mode?: "create" | "edit";
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function CommunityForm({
    communityId,
    initialData,
    mode = "create",
    onSuccess,
    onCancel,
}: CommunityFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<
        Omit<CreateCommunityRequest, "ownerId" | "ownerProfileId">
    >({
        name: initialData?.name || "",
        description: initialData?.description || "",
        imageUrl: initialData?.imageUrl || "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                description: initialData.description,
                imageUrl: initialData.imageUrl || "",
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (mode === "edit" && communityId) {
                await CommunityController.updateCommunity(communityId, {
                    name: formData.name,
                    description: formData.description,
                    imageUrl: formData.imageUrl || undefined,
                });
                toast.success("Community updated successfully!");
            } else {
                const [currentProfile, userId] = await Promise.all([
                    ProfileController.getCurrentUserProfile(),
                    AuthController.getUserId(),
                ]);

                await CommunityController.createCommunity({
                    ownerId: userId,
                    ownerProfileId: currentProfile.id,
                    name: formData.name,
                    description: formData.description,
                    imageUrl: formData.imageUrl || undefined,
                });

                setFormData({ name: "", description: "", imageUrl: "" });
                toast.success("Community created successfully!");
            }

            onSuccess?.();
        } catch (error) {
            console.error(
                `Error ${mode === "edit" ? "updating" : "creating"} community:`,
                error,
            );
            toast.error(
                `Failed to ${mode === "edit" ? "update" : "create"} community`,
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {mode === "edit" ? "Edit Community" : "Create Community"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Community Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
                            placeholder="Enter community name"
                            disabled={isSubmitting}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                }))
                            }
                            placeholder="Describe your community"
                            disabled={isSubmitting}
                            required
                            rows={3}
                        />
                    </div>

                    <ImageUpload
                        label="Community Image (Optional)"
                        value={formData.imageUrl}
                        onChange={(url) =>
                            setFormData((prev) => ({
                                ...prev,
                                imageUrl: url || "",
                            }))
                        }
                        disabled={isSubmitting}
                    />

                    <div className="flex gap-2">
                        <Button type="submit" disabled={isSubmitting} size="sm">
                            {isSubmitting
                                ? mode === "edit"
                                    ? "Updating..."
                                    : "Creating..."
                                : mode === "edit"
                                  ? "Update"
                                  : "Create"}
                        </Button>
                        {onCancel && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={isSubmitting}
                                size="sm"
                            >
                                Cancel
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
