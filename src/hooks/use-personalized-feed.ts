import { useCallback, useEffect, useState } from "react";
import type { FeedItem } from "@/services/internal/community/server/feed.actions";
import { FeedController } from "@/services/internal/community/controller/feed.controller";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";

export type { FeedItem };
export type FeedItemResponse = FeedItem;

interface UsePersonalizedFeedOptions {
    limit?: number;
}

export function usePersonalizedFeed(options: UsePersonalizedFeedOptions = {}) {
    const { limit = 20 } = options;
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloading, setReloading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const fetchFeed = useCallback(
        async (currentOffset: number, append = false) => {
            try {
                if (append) {
                    setLoadingMore(true);
                } else if (currentOffset === 0) {
                    setLoading(true);
                } else {
                    setReloading(true);
                }

                // Get current user ID
                const userId = await AuthController.getUserId();
                if (!userId) {
                    throw new Error("User not authenticated");
                }

                // Fetch feed using the controller
                const data = await FeedController.getUserFeed(
                    userId,
                    limit,
                    currentOffset,
                );

                setFeedItems((prev) =>
                    append ? [...prev, ...data.content] : data.content,
                );
                setOffset(currentOffset);
                setHasMore(
                    data.content.length === limit &&
                        data.totalElements > currentOffset + limit,
                );
                setError(null);
            } catch (err) {
                console.error("Error loading feed:", err);
                setError(
                    err instanceof Error ? err.message : "Failed to load feed",
                );
            } finally {
                setLoading(false);
                setReloading(false);
                setLoadingMore(false);
            }
        },
        [limit],
    );

    const reload = useCallback(
        async (options?: { silent?: boolean }) => {
            if (!options?.silent) {
                setReloading(true);
            }
            await fetchFeed(0, false);
        },
        [fetchFeed],
    );

    const loadMore = useCallback(async () => {
        if (!hasMore || loadingMore) return;
        await fetchFeed(offset + limit, true);
    }, [fetchFeed, hasMore, loadingMore, offset, limit]);

    useEffect(() => {
        fetchFeed(0, false);
    }, [fetchFeed]);

    return {
        feedItems,
        loading,
        error,
        reloading,
        reload,
        loadMore,
        hasMore,
        loadingMore,
    };
}
