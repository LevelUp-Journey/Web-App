"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostForm } from "@/components/community/post-form";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import type { Community } from "@/services/internal/community/entities/community.entity";

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
                AuthController.getUserId()
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
                        <p className="text-muted-foreground">{error || "Community not found"}</p>
                    </div>
                </div>
            </div>
        );
    }

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

                <div>
                    <h1 className="text-2xl font-semibold">
                        Create Post in {community.name}
                    </h1>
                    <p className="text-muted-foreground">
                        Share your thoughts with the community
                    </p>
                </div>

                <PostForm
                    communityId={community.id}
                    authorId={authorId}
                    onSuccess={handlePostCreated}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
}