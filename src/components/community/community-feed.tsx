"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCommunityData } from "@/hooks/use-community-data";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";

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

export function CommunityFeed({ communityId, dict }: CommunityFeedProps) {
    const {
        community,
        posts,
        ownerProfile,
        canCreatePost,
        loading,
        error,
        reloading,
        reload,
    } = useCommunityData(communityId);
    const PATHS = useLocalizedPaths();
    const [message, setMessage] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const [composerError, setComposerError] = useState<string | null>(null);

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

    const handleShareMessage = useCallback(async () => {
        if (!community || !message.trim()) return;
        try {
            setIsPosting(true);
            setComposerError(null);

            const content = message.trim();
            const title = content.slice(0, 60) || `Message #${community.name}`;

            const response = await fetch("/api/community/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    communityId: community.id,
                    title,
                    content,
                }),
            });

            if (!response.ok) {
                let errorMessage =
                    dict?.communityFeed?.composerError ||
                    "We couldn't share your message. Please try again.";
                try {
                    const data = (await response.json()) as { error?: string };
                    if (data?.error) {
                        errorMessage = data.error;
                    }
                } catch {
                    // ignore JSON parsing errors
                }
                throw new Error(errorMessage);
            }

            setMessage("");
            await reload({ silent: true });
        } catch (err) {
            console.error("Error sharing message:", err);
            setComposerError(
                err instanceof Error
                    ? err.message
                    : dict?.communityFeed?.composerError ||
                          "We couldn't share your message. Please try again.",
            );
        } finally {
            setIsPosting(false);
        }
    }, [community, dict?.communityFeed?.composerError, message, reload]);

    const renderState = (state: "loading" | "error"): React.ReactElement => (
        <Empty className="min-h-[400px]">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Spinner className="size-6 text-muted-foreground" />
                </EmptyMedia>
                <EmptyTitle>
                    {state === "loading"
                        ? dict?.communityFeed?.loadingTitle ||
                          "Loading community"
                        : dict?.communityFeed?.failedToLoad ||
                          "We couldn't load this community"}
                </EmptyTitle>
                <EmptyDescription>
                    {state === "loading"
                        ? dict?.communityFeed?.loadingDescription ||
                          "Hang tight while we fetch the latest activity."
                        : dict?.communityFeed?.failedToLoadDescription ||
                          "Something went wrong. Try again in a moment."}
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <div className="flex flex-col gap-3 w-full">
                    {state === "error" && (
                        <Button variant="secondary" onClick={handleRetry}>
                            {dict?.communityFeed?.retry || "Retry"}
                        </Button>
                    )}
                    <Button variant="outline" asChild>
                        <Link href={PATHS.DASHBOARD.COMMUNITY.ROOT}>
                            {dict?.communityFeed?.back || "Back to communities"}
                        </Link>
                    </Button>
                </div>
            </EmptyContent>
        </Empty>
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

    const composerPlaceholder =
        dict?.communityFeed?.composerPlaceholder?.replace(
            "{community}",
            community.name,
        ) || `Message #${community.name}`;

    return (
        <div className="container mx-auto p-6 space-y-6">
            <Button variant="ghost" asChild>
                <Link href={PATHS.DASHBOARD.COMMUNITY.ROOT}>
                    ← {dict?.communityFeed?.back || "Back to communities"}
                </Link>
            </Button>

            <section className="relative overflow-hidden rounded-2xl border bg-card">
                <div className="absolute inset-0 opacity-50 blur-3xl">
                    <div className="absolute -right-16 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-primary/20" />
                    <div className="absolute -left-16 top-0 h-48 w-48 rounded-full bg-muted/40" />
                </div>
                <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-center">
                    <div className="flex items-center gap-4">
                        <div className="relative h-24 w-24 rounded-2xl border-4 border-background bg-muted overflow-hidden">
                            {community.imageUrl ? (
                                <Image
                                    src={community.imageUrl}
                                    alt={community.name}
                                    fill
                                    sizes="96px"
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-muted-foreground">
                                    {community.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 space-y-5">
                        <div className="space-y-2">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                {dict?.communityFeed?.heroLabel || "Community"}
                            </p>
                            <h1 className="text-3xl font-bold text-balance">
                                {community.name}
                            </h1>
                            <p className="text-sm text-muted-foreground md:text-base">
                                {community.description}
                            </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                    {followerLabel}
                                </p>
                                <p className="text-xl font-semibold">
                                    {followerDisplay}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage
                                        src={ownerProfile?.profileUrl}
                                        alt={getDisplayName(ownerProfile)}
                                    />
                                    <AvatarFallback>
                                        {getInitials(
                                            ownerProfile,
                                            community.name,
                                        )}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                        {dict?.communityFeed?.ownerLabel ||
                                            "Community owner"}
                                    </p>
                                    <p className="font-semibold">
                                        {getDisplayName(ownerProfile)}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                    {dict?.communityFeed?.createdAtLabel ||
                                        "Created on"}
                                </p>
                                <p className="font-semibold">
                                    {formatDate(community.createdAt)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

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
                            <Card key={post.id} className="border-muted">
                                <CardHeader className="gap-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage
                                                src={
                                                    post.authorProfile
                                                        ?.profileUrl ??
                                                    undefined
                                                }
                                                alt={getDisplayName(
                                                    post.authorProfile,
                                                )}
                                            />
                                            <AvatarFallback>
                                                {getInitials(
                                                    post.authorProfile,
                                                    post.title,
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-base">
                                                {post.title}
                                            </CardTitle>
                                            <CardDescription className="text-xs">
                                                {getDisplayName(
                                                    post.authorProfile,
                                                )}{" "}
                                                · {formatDate(post.createdAt)}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm leading-relaxed">
                                        {post.content}
                                    </p>

                                    {post.imageUrl && (
                                        <div className="relative rounded-lg overflow-hidden border min-h-[200px] w-full">
                                            <Image
                                                src={post.imageUrl}
                                                alt={post.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 600px"
                                                className="object-cover"
                                            />
                                        </div>
                                    )}

                                    <Separator />

                                    <div className="space-y-3">
                                        <p className="text-sm font-semibold">
                                            {dict?.communityFeed
                                                ?.commentsTitle || "Comments"}
                                        </p>
                                        {post.comments.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">
                                                {dict?.communityFeed
                                                    ?.emptyComments ||
                                                    "No comments yet"}
                                            </p>
                                        ) : (
                                            <div className="space-y-4">
                                                {post.comments.map(
                                                    (comment) => {
                                                        const commenterProfile =
                                                            post
                                                                .commentProfiles?.[
                                                                comment.authorId
                                                            ];
                                                        return (
                                                            <div
                                                                key={comment.id}
                                                                className="rounded-md border p-3"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <Avatar className="h-8 w-8">
                                                                        <AvatarImage
                                                                            src={
                                                                                commenterProfile?.profileUrl ??
                                                                                undefined
                                                                            }
                                                                            alt={getDisplayName(
                                                                                commenterProfile,
                                                                            )}
                                                                        />
                                                                        <AvatarFallback>
                                                                            {getInitials(
                                                                                commenterProfile,
                                                                                comment.content,
                                                                            )}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <div>
                                                                        <p className="text-sm font-medium">
                                                                            {getDisplayName(
                                                                                commenterProfile,
                                                                            )}
                                                                        </p>
                                                                        <p className="text-xs text-muted-foreground">
                                                                            {formatDate(
                                                                                comment.createdAt,
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <p className="text-sm text-muted-foreground mt-2">
                                                                    {
                                                                        comment.content
                                                                    }
                                                                </p>
                                                            </div>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>

            {canCreatePost && (
                <Card className="border-dashed">
                    <CardHeader>
                        <CardTitle>
                            {dict?.communityFeed?.composerTitle ||
                                "Share an update"}
                        </CardTitle>
                        <CardDescription>
                            {dict?.communityFeed?.composerDescription ||
                                "Messages appear in the community feed for everyone to see."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Textarea
                            value={message}
                            onChange={(event) =>
                                setMessage(
                                    event.target.value.slice(0, MESSAGE_LIMIT),
                                )
                            }
                            placeholder={composerPlaceholder}
                            maxLength={MESSAGE_LIMIT}
                            className="min-h-[120px]"
                        />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                                {message.length}/{MESSAGE_LIMIT}
                            </span>
                            {composerError && (
                                <span className="text-destructive">
                                    {composerError}
                                </span>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button
                            onClick={handleShareMessage}
                            disabled={isPosting || !message.trim()}
                        >
                            {isPosting && (
                                <Spinner className="mr-2 size-4 text-background" />
                            )}
                            {dict?.communityFeed?.composerButton ||
                                "Send message"}
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
