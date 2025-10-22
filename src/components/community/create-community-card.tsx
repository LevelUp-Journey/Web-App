"use client";

import { useState } from "react";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import { ProfileController } from "@/services/internal/profiles/controller/profile.controller";
import type { CreateCommunityRequest } from "@/services/internal/community/server/community.actions";
import ImageUpload from "@/components/ui/image-upload";

interface CreateCommunityCardProps {
    userRole?: string;
}

export default function CreateCommunityCard({ userRole }: CreateCommunityCardProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<Omit<CreateCommunityRequest, 'ownerId'>>({
        name: "",
        description: "",
        imageUrl: "",
    });

    // Only show for TEACHER or ADMIN roles
    if (userRole !== 'ROLE_TEACHER' && userRole !== 'ROLE_ADMIN') {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsCreating(true);

            // Get current user profile to get the ownerId
            const currentProfile = await ProfileController.getCurrentUserProfile();

            const request: CreateCommunityRequest = {
                ownerId: currentProfile.id,
                name: formData.name,
                description: formData.description,
                imageUrl: formData.imageUrl || undefined,
            };

            await CommunityController.createCommunity(request);

            // Reset form and hide
            setFormData({ name: "", description: "", imageUrl: "" });
            setShowForm(false);

            // TODO: Show success toast
            console.log("Community created successfully!");
        } catch (error) {
            console.error("Error creating community:", error);
            // TODO: Show error toast
        } finally {
            setIsCreating(false);
        }
    };

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    if (!showForm) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Users className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <h3 className="font-semibold">Create Community</h3>
                                <p className="text-sm text-muted-foreground">
                                    Start a new community for your students
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={() => setShowForm(true)}
                            variant="outline"
                            size="sm"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Create
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Create New Community
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Community Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            placeholder="Enter community name"
                            disabled={isCreating}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Describe your community"
                            disabled={isCreating}
                            required
                            rows={3}
                        />
                    </div>

                    <ImageUpload
                        label="Community Image (Optional)"
                        value={formData.imageUrl}
                        onChange={(url) => handleInputChange("imageUrl", url || "")}
                        disabled={isCreating}
                    />

                    <div className="flex gap-4 pt-4">
                        <Button type="submit" disabled={isCreating}>
                            {isCreating ? "Creating..." : "Create Community"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowForm(false)}
                            disabled={isCreating}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}