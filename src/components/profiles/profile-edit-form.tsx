"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileImageUpload from "@/components/ui/profile-image-upload";
import { ProfileController } from "@/services/internal/profiles/controller/profile.controller";
import type {
    ProfileResponse,
    UpdateProfileRequest,
} from "@/services/internal/profiles/controller/profile.response";

interface ProfileEditFormProps {
    profileId?: string;
    onCancel?: () => void;
    onSuccess?: () => void;
}

export default function ProfileEditForm({
    profileId,
    onCancel,
    onSuccess,
}: ProfileEditFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<ProfileResponse | null>(null);
    const [formData, setFormData] = useState<UpdateProfileRequest>({
        username: "",
        profileUrl: "",
        firstName: "",
        lastName: "",
    });

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                let profileData: ProfileResponse;

                if (profileId) {
                    profileData =
                        await ProfileController.getProfileByUserId(profileId);
                } else {
                    profileData =
                        await ProfileController.getCurrentUserProfile();
                }

                setProfile(profileData);
                setFormData({
                    username: profileData.username || "",
                    profileUrl: profileData.profileUrl || "",
                    firstName: profileData.firstName || "",
                    lastName: profileData.lastName || "",
                });
            } catch (error) {
                console.error("Error loading profile:", error);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [profileId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setSaving(true);

            if (profileId) {
                await ProfileController.updateProfileByUserId(
                    profileId,
                    formData,
                );
            } else {
                // For current user, we need to get the user ID first
                const currentProfile =
                    await ProfileController.getCurrentUserProfile();
                await ProfileController.updateProfileByUserId(
                    currentProfile.id,
                    formData,
                );
            }

            onSuccess?.();
            router.refresh();
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (
        field: keyof UpdateProfileRequest,
        value: string,
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex justify-center">
                        <ProfileImageUpload
                            value={formData.profileUrl}
                            onChange={(url) =>
                                handleInputChange("profileUrl", url || "")
                            }
                            disabled={saving}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) =>
                                handleInputChange("firstName", e.target.value)
                            }
                            placeholder="Enter your first name"
                            disabled={saving}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) =>
                                handleInputChange("lastName", e.target.value)
                            }
                            placeholder="Enter your last name"
                            disabled={saving}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            value={formData.username}
                            onChange={(e) =>
                                handleInputChange("username", e.target.value)
                            }
                            placeholder="Enter your username"
                            disabled={saving}
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="submit" disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={saving}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
