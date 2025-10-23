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
    const { communities, authorId, usernames, loading, error } =
        useCreatePostData();
    const [selectedCommunity, setSelectedCommunity] =
        useState<Community | null>(null);

    const handlePostCreated = () => {
        router.push("/dashboard/community");
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <div className="max-w-2xl mx-auto space-y-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>

                    <div className="text-center space-y-4">
                        <h1 className="text-xl font-semibold">Error</h1>
                        <p className="text-muted-foreground">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>

                {!selectedCommunity ? (
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-bold">Create Post</h1>
                            <p className="text-muted-foreground">
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
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold">
                                    Create Post in {selectedCommunity.name}
                                </h1>
                                <p className="text-muted-foreground">
                                    Share your thoughts with the community
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setSelectedCommunity(null)}
                            >
                                Change Community
                            </Button>
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
