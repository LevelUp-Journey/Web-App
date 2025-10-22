"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostForm } from "@/components/community/post-form";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";

export default function CreatePostPage() {
    const router = useRouter();
    const [authorId, setAuthorId] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAuthor = async () => {
            try {
                const userId = await AuthController.getUserId();
                setAuthorId(userId);
            } catch (error) {
                console.error("Error loading user ID:", error);
            } finally {
                setLoading(false);
            }
        };

        loadAuthor();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <div className="max-w-2xl mx-auto">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-32"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="max-w-2xl mx-auto">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="flex items-center gap-2 mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
                <PostForm
                    communityId="default-community"
                    authorId={authorId}
                    onSuccess={() => router.push("/dashboard/community")}
                    onCancel={() => router.back()}
                />
            </div>
        </div>
    );
}
