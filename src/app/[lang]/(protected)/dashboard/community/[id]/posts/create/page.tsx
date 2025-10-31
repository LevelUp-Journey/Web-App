"use client";

import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PostForm } from "@/components/community/post-form";
import { Button } from "@/components/ui/button";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import type { Community } from "@/services/internal/community/entities/community.entity";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";

export default function CreatePostInCommunityPage() {
    const router = useRouter();
    const params = useParams();
    const communityId = params.id as string;

    const [community, setCommunity] = useState<Community | null>(null);
    const [authorId, setAuthorId] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, [communityId]);

    const loadData = async () => {
        if (!communityId) {
            setError("No community ID provided");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const [communityData, userId] = await Promise.all([
                CommunityController.getCommunityById(communityId),
                AuthController.getUserId(),
            ]);

            setCommunity(communityData);
            setAuthorId(userId);
        } catch (err) {
            console.error("Error loading data:", err);
            setError("Failed to load community data");
        } finally {
            setLoading(false);
        }
    };

    const handlePostCreated = () => {
        router.push("/dashboard/community");
    };

    const handleCancel = () => {
        router.push(`/dashboard/communities`);
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

    if (error || !community) {
        return (
            <div className="container mx-auto p-6">
                <div className="space-y-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>

                    <div className="text-center space-y-4">
                        <h1 className="text-xl font-semibold">Error</h1>
                        <p className="text-muted-foreground">
                            {error || "Community not found"}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-background flex flex-col overflow-hidden">
            {/* Simple Header - No border separation */}
            <div className="flex items-center px-4 py-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="flex items-center gap-2 -ml-2"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span className="font-medium">Back</span>
                </Button>
            </div>

            {/* Content - Upper center positioning */}
            <div className="flex-1 flex items-start justify-center px-4 pt-8 overflow-hidden">
                <div className="w-full max-w-2xl space-y-4">
                    {/* Title */}
                    <h1 className="text-2xl font-bold text-center">
                        Create post in {community.name}
                    </h1>

                    {/* Post Form - Full width within container */}
                    <PostForm
                        communityId={community.id}
                        authorId={authorId}
                        onSuccess={handlePostCreated}
                        onCancel={handleCancel}
                    />
                </div>
            </div>
        </div>
    );
}
