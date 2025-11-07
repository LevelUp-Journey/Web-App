"use client";

import { Edit, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";
import type { ProfileResponse } from "@/services/internal/profiles/profiles/controller/profile.response";
import { Skeleton } from "../ui/skeleton";

interface ProfileCardProps {
    showEditButton?: boolean;
    onEdit?: () => void;
}

export default function ProfileCard({
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
                const profileData =
                    await ProfileController.getCurrentUserProfile();

                if (!profileData) {
                    setError("Profile not found");
                    return;
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
    }, []);

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="flex items-center space-x-4">
                            <Skeleton className="w-16 h-16 rounded-full"></Skeleton>
                            <div className="space-y-2">
                                <Skeleton className="h-4 rounded w-32"></Skeleton>
                                <Skeleton className="h-4 rounded w-24"></Skeleton>
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
            </CardContent>
        </Card>
    );
}
