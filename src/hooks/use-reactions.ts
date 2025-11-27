"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ReactionController } from "@/services/internal/community/controller/reaction.controller";
import {
    REACTION_TYPES,
    type ReactionCount,
    type ReactionType,
} from "@/services/internal/community/entities/reaction.entity";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";

type UseReactionsOptions = {
    initialCounts?: ReactionCount;
    initialUserReaction?: string | null;
};

const normalizeReactionType = (
    reaction: string | null | undefined,
): ReactionType | null => {
    if (!reaction) return null;
    const lower = reaction.toLowerCase() as ReactionType;
    return REACTION_TYPES.includes(lower) ? lower : null;
};

const ensureCounts = (
    postId: string,
    counts?: ReactionCount | null,
): ReactionCount => {
    const normalizedCounts: Partial<Record<ReactionType, number>> = {};

    for (const type of REACTION_TYPES) {
        const value =
            counts?.counts?.[type] ??
            (counts?.counts as Record<string, number | undefined> | undefined)?.[
                type.toUpperCase()
            ];
        normalizedCounts[type] = value ?? 0;
    }

    const total =
        counts?.totalCount ??
        Object.values(normalizedCounts).reduce(
            (acc, value) => acc + (value ?? 0),
            0,
        );

    return {
        postId: counts?.postId ?? postId,
        counts: normalizedCounts,
        totalCount: total,
    };
};

export function useReactions(
    postId: string,
    options: UseReactionsOptions = {},
) {
    const [reactionCounts, setReactionCounts] = useState<ReactionCount>(() =>
        ensureCounts(postId, options.initialCounts),
    );
    const [userReaction, setUserReaction] = useState<ReactionType | null>(() =>
        normalizeReactionType(options.initialUserReaction),
    );
    const [isLoading, setIsLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const loadCurrentUser = useCallback(async () => {
        try {
            const userId = await AuthController.getUserId();
            setCurrentUserId(userId);
        } catch (error) {
            console.error("Failed to load current user:", error);
            setCurrentUserId(null);
        }
    }, []);

    const loadReactionCounts = useCallback(async () => {
        try {
            const counts = await ReactionController.getReactionCounts(postId);
            setReactionCounts(ensureCounts(postId, counts));
        } catch (error) {
            console.error("Failed to load reaction counts:", error);
        }
    }, [postId]);

    const loadUserReaction = useCallback(async () => {
        if (!currentUserId) return;

        try {
            const reaction = await ReactionController.getUserReaction(postId);
            setUserReaction(normalizeReactionType(reaction?.reactionType));
        } catch (error) {
            console.error("Failed to load user reaction:", error);
            setUserReaction(null);
        }
    }, [currentUserId, postId]);

    useEffect(() => {
        void loadCurrentUser();
    }, [loadCurrentUser]);

    useEffect(() => {
        void loadReactionCounts();
    }, [loadReactionCounts]);

    useEffect(() => {
        void loadUserReaction();
    }, [loadUserReaction]);

    useEffect(() => {
        setReactionCounts((prev) => ensureCounts(postId, prev));
    }, [postId]);

    const adjustCounts = useCallback(
        (from: ReactionType | null, to: ReactionType | null) => {
            setReactionCounts((prev) => {
                const base = ensureCounts(postId, prev);
                const nextCounts = { ...base.counts };

                if (from) {
                    nextCounts[from] = Math.max(
                        0,
                        (nextCounts[from] ?? 0) - 1,
                    );
                }

                if (to) {
                    nextCounts[to] = (nextCounts[to] ?? 0) + 1;
                }

                const totalCount = Object.values(nextCounts).reduce(
                    (acc, value) => acc + (value ?? 0),
                    0,
                );

                return {
                    ...base,
                    counts: nextCounts,
                    totalCount,
                };
            });
        },
        [postId],
    );

    const react = useCallback(
        async (nextReaction: ReactionType) => {
            if (!currentUserId) {
                console.warn(
                    "useReactions: cannot toggle reaction - user not authenticated",
                );
                toast.error("Inicia sesión para reaccionar.");
                return;
            }

            if (isLoading) {
                return;
            }

            const previousReaction = userReaction;
            setIsLoading(true);

            // Optimistic update
            if (previousReaction === nextReaction) {
                adjustCounts(previousReaction, null);
                setUserReaction(null);
                try {
                    await ReactionController.deleteReaction(postId);
                    await loadReactionCounts();
                } catch (error) {
                    console.error("Failed to remove reaction:", error);
                    adjustCounts(null, previousReaction);
                    setUserReaction(previousReaction);
                    toast.error(
                        "No pudimos quitar tu reacción. Inténtalo de nuevo.",
                    );
                } finally {
                    setIsLoading(false);
                }
                return;
            }

            adjustCounts(previousReaction, nextReaction);
            setUserReaction(nextReaction);

            try {
                await ReactionController.createReaction(postId, {
                    reactionType: nextReaction,
                });
                await loadReactionCounts();
            } catch (error) {
                console.error("Failed to update reaction:", error);
                adjustCounts(nextReaction, previousReaction);
                setUserReaction(previousReaction);
                toast.error(
                    "No pudimos actualizar tu reacción. Inténtalo de nuevo.",
                );
            } finally {
                setIsLoading(false);
            }
        },
        [
            adjustCounts,
            currentUserId,
            isLoading,
            loadReactionCounts,
            postId,
            userReaction,
        ],
    );

    const refresh = useCallback(async () => {
        await Promise.all([loadReactionCounts(), loadUserReaction()]);
    }, [loadReactionCounts, loadUserReaction]);

    return {
        reactionCounts,
        userReaction,
        isLoading,
        react,
        refresh,
        reactionCount: reactionCounts.totalCount ?? 0,
    };
}
