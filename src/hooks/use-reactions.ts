"use client";

import { useState, useEffect } from "react";
import { ReactionController } from "@/services/internal/community/controller/reaction.controller";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { toast } from "sonner";
import type { Reaction } from "@/services/internal/community/entities/reaction.entity";

export function useReactions(postId: string) {
    const [reactions, setReactions] = useState<Reaction[]>([]);
    const [userReaction, setUserReaction] = useState<Reaction | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        loadReactions();
        loadCurrentUser();
    }, [postId]);

    const loadReactions = async () => {
        try {
            const reactionsData = await ReactionController.getReactionsByPostId(postId);
            setReactions(reactionsData);
        } catch (error) {
            console.error("Failed to load reactions:", error);
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
        if (currentUserId && reactions.length >= 0) {  // Allow checking even with empty reactions array
            const userReaction = reactions.find(r => r.userId === currentUserId);
            setUserReaction(userReaction || null);
        } else if (!currentUserId) {
            setUserReaction(null);  // Clear user reaction if no current user
        }
    }, [currentUserId, reactions]);

    const toggleReaction = async () => {
        if (!currentUserId) {
            console.warn("useReactions: cannot toggle reaction - user not authenticated");
            return;
        }

        if (isLoading) {
            return;
        }

        setIsLoading(true);
        try {
            if (userReaction) {
                // Remove reaction
                await ReactionController.deleteReaction(userReaction.id);
                setReactions(prev => prev.filter(r => r.id !== userReaction.id));
                setUserReaction(null);
            } else {
                // Add reaction
                const newReaction = await ReactionController.createReaction({
                    postId,
                    userId: currentUserId,
                    reactionType: 'LIKE'
                });
                setReactions(prev => [...prev, newReaction]);
                setUserReaction(newReaction);
            }
        } catch (error) {
            console.error("Failed to toggle reaction:", error);
            toast.error("Failed to update reaction. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        reactions,
        userReaction,
        isLoading,
        toggleReaction,
        reactionCount: reactions.length
    };
}