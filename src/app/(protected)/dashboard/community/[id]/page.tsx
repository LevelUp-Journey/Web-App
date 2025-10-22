"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Users, Plus, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PostFeed } from "@/components/community/post-feed";
import { useCommunityData } from "@/hooks/use-community-data";

export default function CommunityPage() {
    const params = useParams();
    const router = useRouter();
    const communityId = params.id as string;
    const { community, posts, ownerProfile, currentUserId, loading } = useCommunityData(communityId);

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <p className="text-muted-foreground">Loading community...</p>
                </div>
            </div>
        );
    }

    if (!community) {
        return (
            <div className="container mx-auto p-6">
                <div className="max-w-2xl mx-auto space-y-6">
                    <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                    <div className="text-center space-y-4">
                        <h1 className="text-xl font-semibold">Community not found</h1>
                    </div>
                </div>
            </div>
        );
    }

    const isOwner = currentUserId === community.ownerId;

    return (
        <div className="container mx-auto p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>

                {/* Community Header */}
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
                                        <Button variant="outline" onClick={() => router.push(`/dashboard/community/edit?id=${community.id}`)}>
                                            Settings
                                        </Button>
                                    )}
                                    <Button onClick={() => router.push(`/dashboard/community/posts/create`)}>
                                        <Plus className="h-4 w-4 mr-2" /> Create Post
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </div>
                </Card>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-6 text-center">
                            <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                            <div className="text-2xl font-bold">0</div>
                            <p className="text-sm text-muted-foreground">Members</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 text-center">
                            <MessageSquare className="h-8 w-8 text-primary mx-auto mb-2" />
                            <div className="text-2xl font-bold">{posts.length}</div>
                            <p className="text-sm text-muted-foreground">Posts</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 text-center">
                            <Badge variant="secondary" className="text-lg px-3 py-1">Active</Badge>
                            <p className="text-sm text-muted-foreground mt-2">Status</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Posts Feed */}
                <Card>
                    <CardHeader><CardTitle>Recent Posts</CardTitle></CardHeader>
                    <CardContent>
                        <PostFeed posts={posts} title="Community Posts" showSearch={false} canCreatePost={true} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}