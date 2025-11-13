"use client";

import { Calendar, UserMinus, UserPlus, Users } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSubscriptionContext } from "@/contexts/subscription-context";
import { SubscriptionController } from "@/services/internal/community/controller/subscription.controller";

interface CommunityHeaderProps {
    community: {
        id: string;
        name: string;
        description: string;
        imageUrl?: string | null;
        followerCount: number;
        createdAt: string | Date;
    };
    ownerProfile: {
        firstName?: string | null;
        lastName?: string | null;
        username?: string | null;
        profileUrl?: string | null;
    } | null;
    dict: Dictionary;
    isFollowing: boolean;
    followId: string | null;
    onFollowUpdated: () => void;
    getDisplayName: (profile: any) => string;
    getInitials: (profile: any, fallback: string) => string;
    formatDate: (date: string | Date) => string;
}

export function CommunityHeader({
    community,
    ownerProfile,
    dict,
    isFollowing,
    followId,
    onFollowUpdated,
    getDisplayName,
    getInitials,
    formatDate,
}: CommunityHeaderProps) {
    const { refreshSubscriptions } = useSubscriptionContext();
    const [loading, setLoading] = useState(false);
    const [localIsFollowing, setLocalIsFollowing] = useState(isFollowing);
    const [localFollowId, setLocalFollowId] = useState(followId);
    const [localFollowerCount, setLocalFollowerCount] = useState(
        community.followerCount,
    );

    const followerLabel =
        dict?.communityFeed?.followersLabel ||
        dict?.communityCard?.followers ||
        "Followers";

    const followerDisplay = new Intl.NumberFormat().format(localFollowerCount);

    const handleToggleFollow = async () => {
        if (loading) return;

        setLoading(true);
        try {
            if (localIsFollowing && localFollowId) {
                // Unsubscribe
                const success =
                    await SubscriptionController.deleteSubscription(
                        localFollowId,
                    );
                if (success) {
                    setLocalIsFollowing(false);
                    setLocalFollowId(null);
                    setLocalFollowerCount((prev) => Math.max(0, prev - 1));
                    onFollowUpdated();
                    refreshSubscriptions(); // Update sidebar
                }
            } else {
                // Subscribe
                const subscription =
                    await SubscriptionController.createSubscription(
                        community.id,
                    );
                if (subscription) {
                    setLocalIsFollowing(true);
                    setLocalFollowId(subscription.id);
                    setLocalFollowerCount((prev) => prev + 1);
                    onFollowUpdated();
                    refreshSubscriptions(); // Update sidebar
                }
            }
        } catch (error) {
            console.error("Error toggling subscription:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader className="space-y-4">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Community Image */}
                    <div className="relative h-24 w-24 shrink-0 rounded-full overflow-hidden bg-transparent">
                        {community.imageUrl ? (
                            <Image
                                src={community.imageUrl}
                                alt={community.name}
                                fill
                                sizes="96px"
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-muted-foreground bg-muted">
                                {community.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                    {/* Community Info */}
                    <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-1">
                                <Badge variant="secondary" className="mb-2">
                                    {dict?.communityFeed?.heroLabel ||
                                        "Community"}
                                </Badge>
                                <h1 className="text-2xl md:text-3xl font-bold">
                                    {community.name}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {community.description}
                                </p>
                            </div>
                            <Button
                                onClick={handleToggleFollow}
                                disabled={loading}
                                variant={
                                    localIsFollowing ? "outline" : "default"
                                }
                                size="sm"
                                className="shrink-0"
                            >
                                {localIsFollowing ? (
                                    <>
                                        <UserMinus className="mr-2 h-4 w-4" />
                                        {dict?.communityFeed?.unfollowButton ||
                                            "Unfollow"}
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        {dict?.communityFeed?.followButton ||
                                            "Follow"}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Followers */}
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">
                                {followerLabel}
                            </p>
                            <p className="text-xl font-bold">
                                {followerDisplay}
                            </p>
                        </div>
                    </div>

                    {/* Owner */}
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 rounded-lg">
                            <AvatarImage
                                src={ownerProfile?.profileUrl ?? undefined}
                                alt={getDisplayName(ownerProfile)}
                            />
                            <AvatarFallback>
                                {getInitials(ownerProfile, community.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-xs text-muted-foreground">
                                {dict?.communityFeed?.ownerLabel ||
                                    "Community owner"}
                            </p>
                            <p className="text-sm font-semibold">
                                {getDisplayName(ownerProfile)}
                            </p>
                        </div>
                    </div>

                    {/* Created Date */}
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">
                                {dict?.communityFeed?.createdAtLabel ||
                                    "Created on"}
                            </p>
                            <p className="text-sm font-semibold">
                                {formatDate(community.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
