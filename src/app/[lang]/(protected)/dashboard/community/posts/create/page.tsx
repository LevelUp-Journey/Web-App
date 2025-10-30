"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostForm } from "@/components/community/post-form";
import { CommunitySelector } from "@/components/community/community-selector";
import { useCreatePostData } from "@/hooks/use-create-post-data";
import type { Community } from "@/services/internal/community/entities/community.entity";

export default function CreatePostPage() {
    const router = useRouter();
    const { communities, authorId, usernames, canCreatePost, loading, error } =
        useCreatePostData();
    const [selectedCommunity, setSelectedCommunity] =
        useState<Community | null>(null);

    const handlePostCreated = () => {
        router.push("/dashboard/community");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
                    <div className="flex items-center justify-center px-4 py-3">
                        <h1 className="text-lg font-semibold">Create Post</h1>
                    </div>
                </div>
                <div className="flex items-center justify-center min-h-[400px]">
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background">
                <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
                    <div className="flex items-center justify-between px-4 py-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.back()}
                            className="flex items-center gap-2 -ml-2"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span className="font-medium">Back</span>
                        </Button>
                        <h1 className="text-lg font-semibold">Error</h1>
                        <div className="w-16" />
                    </div>
                </div>
                <div className="px-4 py-6">
                    <div className="text-center space-y-4">
                        <h2 className="text-xl font-semibold">Error</h2>
                        <p className="text-muted-foreground">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!canCreatePost) {
        return (
            <div className="min-h-screen bg-background">
                <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
                    <div className="flex items-center justify-between px-4 py-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.back()}
                            className="flex items-center gap-2 -ml-2"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span className="font-medium">Back</span>
                        </Button>
                        <h1 className="text-lg font-semibold">Create Post</h1>
                        <div className="w-16" />
                    </div>
                </div>
                <div className="px-4 py-6">
                    <div className="text-center space-y-6 border-2 border-dashed rounded-xl p-8 mx-4">
                        <h2 className="text-2xl font-semibold">Cannot Create Posts</h2>
                        <p className="text-muted-foreground text-base max-w-sm mx-auto leading-relaxed">
                            Only teachers and administrators can create new posts. 
                            However, you can still comment on existing posts and participate in discussions!
                        </p>
                        <Button onClick={() => router.push("/dashboard/community")} className="rounded-full px-6">
                            Browse Communities
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile Header */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
                <div className="flex items-center justify-between px-4 py-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="flex items-center gap-2 -ml-2"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="font-medium">Back</span>
                    </Button>

                    {!selectedCommunity ? (
                        <h1 className="text-lg font-semibold">Create Post</h1>
                    ) : (
                        <h1 className="text-lg font-semibold truncate max-w-[200px]">
                            {selectedCommunity.name}
                        </h1>
                    )}

                    <div className="w-16" /> {/* Spacer for centering */}
                </div>
            </div>

            {/* Mobile Content */}
                        {/* Mobile Content */}
            <div className="px-4 py-6 pb-24">
                {!selectedCommunity ? (
                    <div className="space-y-6">
                        <div className="text-center space-y-3">
                            <h2 className="text-2xl font-bold">Create Post</h2>
                            <p className="text-muted-foreground text-base">
                                Select a community to share your post
                            </p>
                        </div>

                        <CommunitySelector
                            communities={communities}
                            usernames={usernames}
                            onSelectCommunity={setSelectedCommunity}
                        />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="text-center space-y-2 mb-6">
                            <h2 className="text-xl font-semibold">
                                Create Post in {selectedCommunity.name}
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                Share your thoughts with the community
                            </p>
                        </div>

                        <PostForm
                            communityId={selectedCommunity.id}
                            authorId={authorId}
                            onSuccess={handlePostCreated}
                            onCancel={() => setSelectedCommunity(null)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
