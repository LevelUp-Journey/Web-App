"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUpload from "@/components/ui/image-upload";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import { ProfileController } from "@/services/internal/profiles/controller/profile.controller";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import type { CreateCommunityRequest } from "@/services/internal/community/server/community.actions";

interface CommunityFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function CommunityForm({ onSuccess, onCancel }: CommunityFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<Omit<CreateCommunityRequest, 'ownerId' | 'ownerProfileId'>>({
        name: "",
        description: "",
        imageUrl: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
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
            onSuccess?.();
        } catch (error) {
            console.error("Error creating community:", error);
            toast.error("Failed to create community");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Create Community
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Community Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Describe your community"
                            disabled={isSubmitting}
                            required
                            rows={3}
                        />
                    </div>

                    <ImageUpload
                        label="Community Image (Optional)"
                        value={formData.imageUrl}
                        onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url || "" }))}
                        disabled={isSubmitting}
                    />

                    <div className="flex gap-2">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create"}
                        </Button>
                        {onCancel && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={isSubmitting}
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
