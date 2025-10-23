"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostFeed } from "@/components/community/post-feed";
import { useCommunityData } from "@/hooks/use-community-data";

export default function CommunityPage() {
    const params = useParams();
    const router = useRouter();
    const communityId = params.id as string;
    const { community, posts, ownerProfile, currentUserId, canCreatePost, loading } = useCommunityData(communityId);

    if (loading) {
        return (
            <div className="w-full h-full overflow-y-auto">
                <div className="container mx-auto p-6">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <p className="text-muted-foreground">Loading community...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!community) {
        return (
            <div className="w-full h-full overflow-y-auto">
                <div className="container mx-auto p-6">
                    <div className="max-w-2xl mx-auto space-y-6">
                        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back
                        </Button>
                        <div className="text-center space-y-4">
                            <h1 className="text-xl font-semibold">Community not found</h1>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const isOwner = currentUserId === community.ownerId;

    return (
        <div className="w-full h-full overflow-y-auto">
            <div className="container mx-auto p-6">
                <div className="max-w-6xl mx-auto space-y-6">
                        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>                    {/* Community Header */}
                    <Card>
                        <div className="relative">
                            <div className="w-full h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 rounded-t-lg">
                                {community.imageUrl ? (
                                    <img src={community.imageUrl} alt={`${community.name} banner`} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-6xl font-bold text-primary/20">
                                            {community.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-4">
                                        <div>
                                            <h1 className="text-3xl font-bold">{community.name}</h1>
                                            <p className="text-muted-foreground mt-2">{community.description}</p>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={ownerProfile?.profileUrl} />
                                                <AvatarFallback>{ownerProfile?.username?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Created by {ownerProfile?.username || "Unknown User"}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {ownerProfile?.firstName} {ownerProfile?.lastName}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {isOwner && (
                                            <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/community/edit?id=${community.id}`)}>
                                                Settings
                                            </Button>
                                        )}
                                        {canCreatePost && (
                                            <Button size="sm" onClick={() => router.push(`/dashboard/community/posts/create`)}>
                                                <Plus className="h-4 w-4 mr-2" /> Create Post
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </div>
                    </Card>

                    {/* Posts Feed */}
                    <Card>
                        <CardHeader><CardTitle>Recent Posts</CardTitle></CardHeader>
                        <CardContent>
                            <PostFeed posts={posts} title="Community Posts" showSearch={false} canCreatePost={canCreatePost} layout="list" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}