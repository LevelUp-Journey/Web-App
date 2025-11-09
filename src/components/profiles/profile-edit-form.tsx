"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProfileImageUpload from "@/components/ui/profile-image-upload";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";
import type {
    ProfileResponse,
    UpdateProfileRequest,
} from "@/services/internal/profiles/profiles/controller/profile.response";

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
                let profileData: ProfileResponse | null;

                if (profileId) {
                    profileData =
                        await ProfileController.getProfileByUserId(profileId);
                } else {
                    profileData =
                        await ProfileController.getCurrentUserProfile();
                }

                if (!profileData) {
                    console.error("Profile data not available");
                    return;
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
                const result = await ProfileController.updateProfileByUserId(
                    profileId,
                    formData,
                );

                if (!result) {
                    console.error("Failed to update profile");
                    alert(
                        "Error: Could not update profile. Profile service may be unavailable.",
                    );
                    return;
                }
            } else {
                // For current user, we need to get the user ID first
                const currentProfile =
                    await ProfileController.getCurrentUserProfile();

                if (!currentProfile) {
                    console.error("Failed to get current profile");
                    alert(
                        "Error: Could not load profile data. Profile service may be unavailable.",
                    );
                    return;
                }

                const result = await ProfileController.updateProfileByUserId(
                    currentProfile.id,
                    formData,
                );

                if (!result) {
                    console.error("Failed to update profile");
                    alert(
                        "Error: Could not update profile. Profile service may be unavailable.",
                    );
                    return;
                }
            }

            onSuccess?.();
            router.refresh();
        } catch (error) {
            console.error("Error updating profile:", error);
            alert(
                "Error: An unexpected error occurred while updating your profile.",
            );
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
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex justify-center">
                        <Skeleton className="h-24 w-24 rounded-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex gap-4 pt-4">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-20" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!profile) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">
                            Unable to load profile data. The profile service may
                            be temporarily unavailable.
                        </p>
                        <Button variant="outline" onClick={onCancel}>
                            Go Back
                        </Button>
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
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center">
                        <ProfileImageUpload
                            value={formData.profileUrl}
                            onChange={(url) =>
                                handleInputChange("profileUrl", url || "")
                            }
                            disabled={saving}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) =>
                                    handleInputChange(
                                        "firstName",
                                        e.target.value,
                                    )
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
                                    handleInputChange(
                                        "lastName",
                                        e.target.value,
                                    )
                                }
                                placeholder="Enter your last name"
                                disabled={saving}
                            />
                        </div>
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
