"use client";

import { ArrowLeft, UserMinus, UserPlus, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PostController } from "@/services/internal/community/controller/post.controller";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";
import type { ProfileResponse } from "@/services/internal/profiles/profiles/controller/profile.response";

export default function UserProfilePage() {
    const params = useParams();
    const router = useRouter();
    const profileId = params.profileId as string;

    const [profile, setProfile] = useState<ProfileResponse | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string>("");

    const loadData = useCallback(async () => {
        if (!profileId) return;

        try {
            setLoading(true);
            const [profileData, userId, _userPosts] = await Promise.all([
                ProfileController.getProfileById(profileId),
                AuthController.getUserId(),
                PostController.getPostsByUserId(profileId),
            ]);

            setProfile(profileData);
            setCurrentUserId(userId);

            // For now, set dummy values
            setFollowersCount(0);
            setFollowingCount(0);
            setIsFollowing(false);
        } catch (error) {
            console.error("Error loading profile data:", error);
        } finally {
            setLoading(false);
        }
    }, [profileId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleFollow = async () => {
        // TODO: Implement follow/unfollow functionality
        setIsFollowing(!isFollowing);
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <p className="text-muted-foreground">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="container mx-auto p-6">
                <div className="max-w-2xl mx-auto space-y-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                    <div className="text-center space-y-4">
                        <h1 className="text-xl font-semibold">
                            Profile not found
                        </h1>
                    </div>
                </div>
            </div>
        );
    }

    const isOwnProfile = currentUserId === profileId;

    return (
        <div className="container mx-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>

                {/* Profile Header */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-4">
                                <Avatar className="w-20 h-20">
                                    <AvatarImage
                                        src={profile.profileUrl}
                                        alt={profile.username}
                                    />
                                    <AvatarFallback className="text-lg">
                                        {profile.firstName?.[0]}
                                        {profile.lastName?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h1 className="text-2xl font-bold">
                                        {profile.firstName} {profile.lastName}
                                    </h1>
                                    <p className="text-muted-foreground">
                                        @{profile.username}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            <span className="text-sm">
                                                {followersCount} followers
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            <span className="text-sm">
                                                {followingCount} following
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {!isOwnProfile && (
                                <Button
                                    onClick={handleFollow}
                                    variant={
                                        isFollowing ? "outline" : "default"
                                    }
                                >
                                    {isFollowing ? (
                                        <>
                                            <UserMinus className="h-4 w-4 mr-2" />
                                            Unfollow
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="h-4 w-4 mr-2" />
                                            Follow
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
