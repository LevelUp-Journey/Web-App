"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommunityForm } from "@/components/community/community-form";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import type { Community } from "@/services/internal/community/entities/community.entity";

export default function EditCommunityPage() {
    const router = useRouter();
    const params = useParams();
    const communityId = params.id as string;
    
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
            const data = await CommunityController.getCommunityById(communityId);
            setCommunity(data);
        } catch (err) {
            console.error("Error loading community:", err);
            setError("Failed to load community");
        } finally {
            setLoading(false);
        }
    };

    const handleSuccess = () => {
        router.push("/dashboard/communities");
    };

    const handleCancel = () => {
        router.back();
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <p className="text-muted-foreground">Loading community...</p>
                </div>
            </div>
        );
    }

    if (error || !community) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                    <p className="text-destructive">{error || "Community not found"}</p>
                    <Button onClick={() => router.push("/dashboard/communities")}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Communities
                    </Button>
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

                <CommunityForm
                    mode="edit"
                    communityId={communityId || undefined}
                    initialData={community}
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
}
