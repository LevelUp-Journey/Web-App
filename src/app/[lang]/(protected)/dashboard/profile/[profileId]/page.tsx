"use client";

import {
    ArrowLeft,
    MessageSquare,
    UserMinus,
    UserPlus,
    Users,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FeedPostCard } from "@/components/community/feed-post-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import { PostController } from "@/services/internal/community/controller/post.controller";
import type { Community } from "@/services/internal/community/entities/community.entity";
import type { Post } from "@/services/internal/community/entities/post.entity";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";
import type { ProfileResponse } from "@/services/internal/profiles/profiles/controller/profile.response";

export default function UserProfilePage() {
    const params = useParams();
    const router = useRouter();
    const profileId = params.profileId as string;

    const [profile, setProfile] = useState<ProfileResponse | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [communities, setCommunities] = useState<Community[]>([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string>("");

    useEffect(() => {
        loadData();
    }, [profileId]);

    const loadData = async () => {
        if (!profileId) return;

        try {
            setLoading(true);
            const [profileData, userId, userPosts] = await Promise.all([
                ProfileController.getProfileById(profileId),
                AuthController.getUserId(),
                PostController.getPostsByUserId(profileId),
            ]);

            setProfile(profileData);
            setCurrentUserId(userId);
            setPosts(userPosts);

            // Load communities created by this user
            const allCommunities = await CommunityController.getCommunities();
            const userCommunities = allCommunities.filter(
                (c) => c.ownerProfileId === profileId,
            );
            setCommunities(userCommunities);

            // TODO: Load follow status, followers and following counts
            // For now, set dummy values
            setFollowersCount(0);
            setFollowingCount(0);
            setIsFollowing(false);
        } catch (error) {
            console.error("Error loading profile data:", error);
        } finally {
            setLoading(false);
        }
    };

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

                {/* Profile Content Tabs */}
                <Tabs defaultValue="posts" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="posts">Posts</TabsTrigger>
                        <TabsTrigger value="communities">
                            Communities
                        </TabsTrigger>
                        <TabsTrigger value="about">About</TabsTrigger>
                    </TabsList>

                    <TabsContent value="posts" className="space-y-4">
                        <div className="space-y-4">
                            {posts.length === 0 ? (
                                <Card>
                                    <CardContent className="p-8 text-center">
                                        <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold mb-2">
                                            No posts yet
                                        </h3>
                                        <p className="text-muted-foreground">
                                            This user hasn't posted anything
                                            yet.
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : (
                                posts.map((post) => (
                                    <FeedPostCard
                                        key={post.id}
                                        post={{
                                            ...post,
                                            authorProfile: {
                                                username: profile.username,
                                                profileUrl: profile.profileUrl,
                                                firstName: profile.firstName,
                                                lastName: profile.lastName,
                                            },
                                            authorProfileId: profileId,
                                        }}
                                    />
                                ))
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="communities" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {communities.length === 0 ? (
                                <Card className="col-span-full">
                                    <CardContent className="p-8 text-center">
                                        <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold mb-2">
                                            No communities
                                        </h3>
                                        <p className="text-muted-foreground">
                                            This user hasn't created any
                                            communities yet.
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : (
                                communities.map((community) => (
                                    <Card
                                        key={community.id}
                                        className="cursor-pointer hover:shadow-md transition-shadow"
                                    >
                                        <CardContent className="p-4">
                                            <h3 className="font-semibold">
                                                {community.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {community.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="about">
                        <Card>
                            <CardHeader>
                                <CardTitle>About</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    More information about this user will be
                                    displayed here.
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
