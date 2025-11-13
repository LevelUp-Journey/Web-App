"use client";

import { useCallback, useEffect, useState } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { usePersonalizedFeed } from "@/hooks/use-personalized-feed";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { FeedPostCard } from "./feed-post-card";

interface FeedTabProps {
    dict: Dictionary;
}

export function FeedTab({ dict }: FeedTabProps) {
    const [currentUserId, setCurrentUserId] = useState<string>("");
    const {
        feedItems,
        loading,
        error,
        reloading,
        reload,
        loadMore,
        hasMore,
        loadingMore,
    } = usePersonalizedFeed({ limit: 20 });

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const userId = await AuthController.getUserId();
                if (userId) {
                    setCurrentUserId(userId);
                }
            } catch (error) {
                console.error("Error fetching user ID:", error);
            }
        };

        fetchUserId();
    }, []);

    const formatDate = useCallback((date: string | Date) => {
        return new Date(date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }, []);

    const handleRetry = useCallback(() => {
        void reload();
    }, [reload]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Spinner className="size-8" />
                <p className="text-sm text-muted-foreground">
                    {dict?.communityFeed?.loading || "Loading your feed..."}
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent className="p-8 text-center space-y-4">
                    <p className="font-semibold text-destructive">
                        {dict?.communityFeed?.error ||
                            "Failed to load your feed"}
                    </p>
                    <p className="text-sm text-muted-foreground">{error}</p>
                    <Button onClick={handleRetry} variant="outline">
                        {dict?.communityFeed?.retry || "Try again"}
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-semibold">
                        {dict?.communityFeed?.postsTitle || "Your Feed"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {dict?.communityFeed?.postsSubtitle ||
                            "Latest posts from communities you follow"}
                    </p>
                </div>
                {reloading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Spinner className="size-4" />
                        {dict?.communityFeed?.refreshing || "Refreshing"}
                    </div>
                )}
            </div>

            {feedItems.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center space-y-2">
                        <p className="font-semibold">
                            {dict?.communityFeed?.emptyPosts || "No posts yet"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {dict?.communityFeed?.emptyPostsDescription ||
                                "Follow some communities to see posts in your feed."}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {feedItems.map((feedItem) => (
                        <FeedPostCard
                            key={feedItem.id}
                            feedItem={feedItem}
                            dict={dict}
                            currentUserId={currentUserId}
                            formatDate={formatDate}
                        />
                    ))}

                    {/* Load More Button */}
                    {hasMore && (
                        <div className="flex justify-center pt-4">
                            <Button
                                variant="outline"
                                onClick={loadMore}
                                disabled={loadingMore}
                                className="gap-2"
                            >
                                {loadingMore ? (
                                    <>
                                        <Spinner className="size-4" />
                                        {dict?.communityFeed?.loadingMore ||
                                            "Loading more..."}
                                    </>
                                ) : (
                                    dict?.communityFeed?.loadMore ||
                                    "Load more posts"
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
