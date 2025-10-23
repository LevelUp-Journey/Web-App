"use client";

import { Edit, Github, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";
import type { ProfileResponse } from "@/services/internal/profiles/profiles/controller/profile.response";

interface ProfileCardProps {
    profileId?: string;
    showEditButton?: boolean;
    onEdit?: () => void;
}

export default function ProfileCard({
    profileId,
    showEditButton = false,
    onEdit,
}: ProfileCardProps) {
    const [profile, setProfile] = useState<ProfileResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
            } catch (err) {
                console.error("Error loading profile:", err);
                setError("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [profileId]);

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error || !profile) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="text-center text-muted-foreground">
                        {error || "Profile not found"}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile
                </CardTitle>
                {showEditButton && onEdit && (
                    <Button variant="outline" size="sm" onClick={onEdit}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                        <AvatarImage
                            src={profile.profileUrl}
                            alt={profile.username}
                        />
                        <AvatarFallback>
                            {profile.firstName?.[0]}
                            {profile.lastName?.[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="text-lg font-semibold">
                            {profile.firstName} {profile.lastName}
                        </h3>
                        <p className="text-muted-foreground">
                            @{profile.username}
                        </p>
                    </div>
                </div>

                {profile.profileUrl &&
                    !profile.profileUrl.includes("cloudinary.com") && (
                        <div className="flex items-center gap-2">
                            <Github className="h-4 w-4 text-muted-foreground" />
                            <a
                                href={profile.profileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                {profile.profileUrl}
                            </a>
                        </div>
                    )}
            </CardContent>
        </Card>
    );
}
