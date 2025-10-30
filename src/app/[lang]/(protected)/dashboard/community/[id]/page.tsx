"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FeedPostCard } from "@/components/community/feed-post-card";
import { useCommunityData } from "@/hooks/use-community-data";

export default function CommunityPage() {
    const params = useParams();
    const router = useRouter();
    const communityId = params.id as string;
    const {
        community,
        posts,
        ownerProfile,
        currentUserId,
        canCreatePost,
        loading,
    } = useCommunityData(communityId);

    if (loading) {
        return (
            <div className="w-full h-full overflow-y-auto">
                <div className="container mx-auto p-6">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <p className="text-muted-foreground">
                            Loading community...
                        </p>
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
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.back()}
                            className="mb-4"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back
                        </Button>
                        <div className="text-center space-y-4">
                            <h1 className="text-xl font-semibold">
                                Community not found
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const isOwner = currentUserId === community.ownerId;

    return (
        <div className="space-y-4 w-full h-full overflow-y-auto bg-muted/20">
            {/* Back Button - Outside Main Layout */}
            <div className="container mx-auto px-4 pt-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-4">
                <div className="max-w-2xl mx-auto space-y-8">
                    {/* Community Header - Full Width Banner */}
                    <Card className="overflow-hidden border-0 shadow-lg">
                        <div className="relative">
                            <div className="w-full h-64 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                                {community.imageUrl ? (
                                    <img
                                        src={community.imageUrl}
                                        alt={`${community.name} banner`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-8xl font-bold text-primary/20">
                                            {community.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <CardContent className="pt-8 pb-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-4 flex-1">
                                        <div>
                                            <h1 className="text-4xl font-bold mb-2">
                                                {community.name}
                                            </h1>
                                            <p className="text-muted-foreground text-lg leading-relaxed">
                                                {community.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage
                                                    src={
                                                        ownerProfile?.profileUrl
                                                    }
                                                />
                                                <AvatarFallback className="text-lg">
                                                    {ownerProfile?.username
                                                        ?.charAt(0)
                                                        .toUpperCase() || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Created by{" "}
                                                    <span className="font-semibold">
                                                        {ownerProfile?.username ||
                                                            "Unknown User"}
                                                    </span>
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Community Owner
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 ml-6">
                                        {isOwner && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    router.push(
                                                        `/dashboard/community/edit?id=${community.id}`,
                                                    )
                                                }
                                                className="whitespace-nowrap"
                                            >
                                                Settings
                                            </Button>
                                        )}
                                        {canCreatePost && (
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    router.push(
                                                        `/dashboard/community/${community.id}/posts/create`,
                                                    )
                                                }
                                                className="whitespace-nowrap"
                                            >
                                                <Plus className="h-4 w-4 mr-2" />{" "}
                                                Create Post
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </div>
                    </Card>

                    {/* Posts Feed */}
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <FeedPostCard key={post.id} post={post} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
