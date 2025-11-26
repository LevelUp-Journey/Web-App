"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ReactionController } from "@/services/internal/community/controller/reaction.controller";
import type { Reaction, ReactionCount } from "@/services/internal/community/entities/reaction.entity";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";

export function useReactions(postId: string) {
    const [reactionCounts, setReactionCounts] = useState<ReactionCount | null>(null);
    const [userReaction, setUserReaction] = useState<Reaction | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const loadReactionCounts = async () => {
        try {
            const counts = await ReactionController.getReactionCounts(postId);
            setReactionCounts(counts);
        } catch (error) {
            console.error("Failed to load reaction counts:", error);
        }
    };

    const loadUserReaction = async () => {
        try {
            const reaction = await ReactionController.getUserReaction(postId);
            setUserReaction(reaction);
        } catch (error) {
            console.error("Failed to load user reaction:", error);
            setUserReaction(null);
        }
    };

    const loadCurrentUser = async () => {
        try {
            const userId = await AuthController.getUserId();
            setCurrentUserId(userId);
        } catch (error) {
            console.error("Failed to load current user:", error);
            setCurrentUserId(null);
        }
    };

    useEffect(() => {
        loadReactionCounts();
        loadUserReaction();
        loadCurrentUser();
    }, []);

    const toggleReaction = async () => {
        if (!currentUserId) {
            console.warn(
                "useReactions: cannot toggle reaction - user not authenticated",
            );
            return;
        }

        if (isLoading) {
            return;
        }

        setIsLoading(true);
        try {
            if (userReaction) {
                // Remove reaction
                await ReactionController.deleteReaction(postId);
                setUserReaction(null);
                // Reload counts after deletion
                await loadReactionCounts();
            } else {
                // Add reaction
                const newReaction = await ReactionController.createReaction(postId, {
                    reactionType: "like",
                });
                if (newReaction) {
                    setUserReaction(newReaction);
                    // Reload counts after creation
                    await loadReactionCounts();
                }
            }
        } catch (error) {
            console.error("Failed to toggle reaction:", error);
            toast.error("Failed to update reaction. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        reactionCounts,
        userReaction,
        isLoading,
        toggleReaction,
        reactionCount: reactionCounts?.totalCount ?? 0,
    };
}
