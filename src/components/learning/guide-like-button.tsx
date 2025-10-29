"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GuideLikeButtonProps {
    guideId: string;
    initialLikes: number;
}

export function GuideLikeButton({
    guideId,
    initialLikes,
}: GuideLikeButtonProps) {
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLike = async () => {
        setIsLoading(true);
        try {
            // TODO: Implement actual like API call
            // await GuideController.toggleLike(guideId);

            setIsLiked(!isLiked);
            setLikes(isLiked ? likes - 1 : likes + 1);

            toast.success(isLiked ? "Like removed" : "Guide liked!");
        } catch (error) {
            console.error("Error liking guide:", error);
            toast.error("Failed to like guide");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleLike}
            disabled={isLoading}
            className={cn(
                "gap-2 transition-colors",
                isLiked &&
                    "bg-red-50 border-red-200 text-red-600 hover:bg-red-100 dark:bg-red-950 dark:border-red-800 dark:text-red-400",
            )}
        >
            <Heart
                className={cn(
                    "h-4 w-4 transition-all",
                    isLiked && "fill-current",
                )}
            />
            <span className="font-medium">{likes}</span>
        </Button>
    );
}
