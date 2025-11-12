"use client";

import Link from "next/link";
import { useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useCommunityData } from "@/hooks/use-community-data";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import { CommunityHeader } from "./community-header";
import { CommunityState } from "./community-state";
import { PostCard } from "./post-card";
import { PostComposer } from "./post-composer";
import type { Dictionary } from "@/app/[lang]/dictionaries";

interface CommunityFeedProps {
    communityId: string;
    dict: Dictionary;
}

type ProfileLike =
    | {
          firstName?: string | null;
          lastName?: string | null;
          username?: string | null;
          profileUrl?: string | null;
      }
    | null
    | undefined;

const MESSAGE_LIMIT = 500;
const COMPOSER_MAX_HEIGHT = 240;

export function CommunityFeed({ communityId, dict }: CommunityFeedProps) {
    const {
        community,
        posts,
        ownerProfile,
        currentUserId,
        canCreatePost,
        canModerate,
        isFollowing,
        followId,
        loading,
        error,
        reloading,
        reload,
        loadMore,
        hasMore,
        loadingMore,
    } = useCommunityData(communityId);
    const PATHS = useLocalizedPaths();

    const followerLabel =
        dict?.communityFeed?.followersLabel ||
        dict?.communityCard?.followers ||
        "Followers";

    const followerDisplay = useMemo(() => {
        const count = community?.followerCount ?? 0;
        return new Intl.NumberFormat().format(count);
    }, [community?.followerCount]);

    const getDisplayName = useCallback(
        (profile: ProfileLike) => {
            if (!profile) {
                return dict?.communityFeed?.unknownUser || "Unknown user";
            }
            const firstName = profile.firstName?.trim();
            const lastName = profile.lastName?.trim();
            const fullName = [firstName, lastName].filter(Boolean).join(" ");
            if (fullName.length > 0) {
                return fullName;
            }
            if (profile.username) {
                return `@${profile.username}`;
            }
            return dict?.communityFeed?.unknownUser || "Unknown user";
        },
        [dict?.communityFeed?.unknownUser],
    );

    const getInitials = useCallback(
        (profile: ProfileLike, fallback: string) => {
            if (profile?.firstName || profile?.lastName) {
                return `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase();
            }
            if (profile?.username) {
                return profile.username.charAt(0).toUpperCase();
            }
            return fallback.charAt(0).toUpperCase();
        },
        [],
    );

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

    const renderState = (state: "loading" | "error"): React.ReactElement => (
        <CommunityState
            state={state}
            dict={dict}
            onRetry={state === "error" ? handleRetry : undefined}
        />
    );

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                {renderState("loading")}
            </div>
        );
    }

    if (error || !community) {
        return (
            <div className="container mx-auto p-6">{renderState("error")}</div>
        );
    }

    return (
        <div
            className={`container mx-auto p-6 space-y-6 ${
                canCreatePost ? "pb-44 sm:pb-52" : ""
            }`}
        >
            <Button variant="ghost" asChild>
                <Link href={PATHS.DASHBOARD.COMMUNITY.ROOT}>
                    ← {dict?.communityFeed?.back || "Back to communities"}
                </Link>
            </Button>

            <CommunityHeader
                community={community}
                ownerProfile={ownerProfile}
                dict={dict}
                isFollowing={isFollowing}
                followId={followId}
                onFollowUpdated={() => reload({ silent: true })}
                getDisplayName={getDisplayName}
                getInitials={getInitials}
                formatDate={formatDate}
            />

            <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-semibold">
                            {dict?.communityFeed?.postsTitle ||
                                "Community feed"}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {dict?.communityFeed?.postsSubtitle ||
                                "Latest posts from this community"}
                        </p>
                    </div>
                    {reloading && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Spinner className="size-4" />
                            {dict?.communityFeed?.refreshing || "Refreshing"}
                        </div>
                    )}
                </div>

                {posts.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center space-y-2">
                            <p className="font-semibold">
                                {dict?.communityFeed?.emptyPosts ||
                                    "No posts yet"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {dict?.communityFeed?.emptyPostsDescription ||
                                    "Be the first to share something with this community."}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                dict={dict}
                                isAdmin={canModerate}
                                currentUserId={currentUserId}
                                onPostDeleted={() => reload({ silent: true })}
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
                                            {dict?.communityFeed?.loadingMore || "Loading more..."}
                                        </>
                                    ) : (
                                        dict?.communityFeed?.loadMore || "Load more posts"
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {canCreatePost && (
                <PostComposer
                    community={community}
                    dict={dict}
                    onPostCreated={() => reload({ silent: true })}
                />
            )}
        </div>
    );
}
