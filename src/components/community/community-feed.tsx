"use client";

import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
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

export function CommunityFeed({ communityId, dict }: CommunityFeedProps) {
    const { community, posts, ownerProfile, loading, error } =
        useCommunityData(communityId);
    const PATHS = useLocalizedPaths();

    const getDisplayName = (profile: ProfileLike) => {
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
    };

    const getInitials = (profile: ProfileLike, fallback: string) => {
        if (profile?.firstName || profile?.lastName) {
            return `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase();
        }
        if (profile?.username) {
            return profile.username.charAt(0).toUpperCase();
        }
        return fallback.charAt(0).toUpperCase();
    };

    const formatDate = (date: string | Date) =>
        new Date(date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                    <Spinner className="size-8 text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">
                        {dict?.communityFeed?.loading ||
                            dict?.common?.loading ||
                            "Loading..."}
                    </p>
                </div>
            </div>
        );
    }

    if (error || !community) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardContent className="p-8 text-center space-y-4">
                        <p className="text-lg font-semibold">
                            {dict?.communityFeed?.failedToLoad ||
                                "We couldn't load this community."}
                        </p>
                        <p className="text-muted-foreground">
                            {dict?.communityFeed?.failedToLoadDescription ||
                                "Please try again later."}
                        </p>
                        <div className="flex justify-center gap-3">
                            <Button
                                variant="secondary"
                                onClick={() => window.location.reload()}
                            >
                                {dict?.communityFeed?.retry || "Retry"}
                            </Button>
                            <Button asChild>
                                <Link href={PATHS.DASHBOARD.COMMUNITY.ROOT}>
                                    {dict?.communityFeed?.back ??
                                        "Back to communities"}
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <Button variant="ghost" asChild>
                <Link href={PATHS.DASHBOARD.COMMUNITY.ROOT}>
                    ← {dict?.communityFeed?.back || "Back to communities"}
                </Link>
            </Button>

            <Card>
                <CardContent className="p-6 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full border bg-muted flex items-center justify-center overflow-hidden relative">
                            {community.imageUrl ? (
                                <Image
                                    src={community.imageUrl}
                                    alt={community.name}
                                    fill
                                    sizes="64px"
                                    className="object-cover"
                                />
                            ) : (
                                <span className="text-2xl font-semibold">
                                    {community.name.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">
                                {community.name}
                            </h1>
                            <p className="text-muted-foreground">
                                {community.description}
                            </p>
                        </div>
                    </div>
                    <Separator />
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                                <AvatarImage
                                    src={ownerProfile?.profileUrl}
                                    alt={getDisplayName(ownerProfile)}
                                />
                                <AvatarFallback>
                                    {getInitials(ownerProfile, community.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-xs uppercase text-muted-foreground tracking-wide">
                                    {dict?.communityFeed?.ownerLabel ||
                                        "Community owner"}
                                </p>
                                <p className="font-semibold">
                                    {getDisplayName(ownerProfile)}
                                </p>
                            </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            <p className="uppercase tracking-wide text-xs">
                                {dict?.communityFeed?.createdAtLabel ||
                                    "Created on"}
                            </p>
                            <p className="font-medium text-foreground">
                                {formatDate(community.createdAt)}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <section className="space-y-4">
                <div>
                    <h2 className="text-xl font-semibold">
                        {dict?.communityFeed?.postsTitle || "Community feed"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {dict?.communityFeed?.postsSubtitle ||
                            "Latest posts from this community"}
                    </p>
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
                            <Card key={post.id}>
                                <CardHeader className="flex flex-col gap-2">
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
                                            <p className="text-xs text-muted-foreground">
                                                {getDisplayName(
                                                    post.authorProfile,
                                                )}{" "}
                                                · {formatDate(post.createdAt)}
                                            </p>
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
        </div>
    );
}
