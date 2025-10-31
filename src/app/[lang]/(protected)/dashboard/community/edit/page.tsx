"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CommunityForm } from "@/components/community/community-form";
import { Button } from "@/components/ui/button";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import type { Community } from "@/services/internal/community/entities/community.entity";

export default function EditCommunityPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const communityId = searchParams.get("id");
    const adminMode = searchParams.get("admin") === "true";

    const [community, setCommunity] = useState<Community | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!communityId) {
            setError("No community ID provided");
            setLoading(false);
            return;
        }

        loadCommunity();
    }, [communityId]);

    const loadCommunity = async () => {
        if (!communityId) return;

        try {
            setLoading(true);
            const data =
                await CommunityController.getCommunityById(communityId);
            setCommunity(data);
        } catch (err) {
            console.error("Error loading community:", err);
            setError("Failed to load community");
        } finally {
            setLoading(false);
        }
    };

    const handleSuccess = () => {
        if (adminMode) {
            router.push("/dashboard/admin/community");
        } else {
            router.push("/dashboard/communities");
        }
    };

    const handleCancel = () => {
        if (adminMode) {
            router.push("/dashboard/admin/community");
        } else {
            router.back();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex items-center justify-center px-4 py-3">
                        <div className="w-16" />
                    </div>
                </div>
                <div className="flex items-center justify-center min-h-[400px]">
                    <p className="text-muted-foreground">Loading community...</p>
                </div>
            </div>
        );
    }

    if (error || !community) {
        return (
            <div className="min-h-screen bg-background">
                <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex items-center justify-between px-4 py-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.back()} // Use router.back() like create post page
                            className="flex items-center gap-2 -ml-2"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span className="font-medium">Back</span>
                        </Button>
                        <div className="w-16" />
                    </div>
                </div>
                <div className="px-4 py-6">
                    <div className="text-center space-y-4">
                        <h2 className="text-xl font-semibold">Error</h2>
                        <p className="text-muted-foreground">{error || "Community not found"}</p>
                        <Button
                            size="sm"
                            onClick={() => router.back()} // Use router.back() like create post page
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Unified Header - same as create post page */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center justify-between px-4 py-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()} // Always use router.back() like create post page
                        className="flex items-center gap-2 -ml-2"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="font-medium">Back</span>
                    </Button>

                    <div className="w-16" /> {/* Spacer for centering */}
                </div>
            </div>

            {/* Unified Content - same padding as create post page */}
            <div className="px-4 py-6 pb-24">
                <div className="max-w-2xl mx-auto">
                    <CommunityForm
                        mode="edit"
                        communityId={communityId || undefined}
                        initialData={community}
                        onSuccess={handleSuccess}
                        onCancel={handleCancel}
                    />
                </div>
            </div>
        </div>
    );
}
