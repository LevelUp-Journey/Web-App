"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreatePostForm from "@/components/community/create-post-form";

export default function CreatePostPage() {
    const router = useRouter();

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
                <CreatePostForm />
            </div>
        </div>
    );
}
