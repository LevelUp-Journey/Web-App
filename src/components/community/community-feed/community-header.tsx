"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Dictionary } from "@/app/[lang]/dictionaries";

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
    getDisplayName: (profile: any) => string;
    getInitials: (profile: any, fallback: string) => string;
    formatDate: (date: string | Date) => string;
}

export function CommunityHeader({
    community,
    ownerProfile,
    dict,
    getDisplayName,
    getInitials,
    formatDate,
}: CommunityHeaderProps) {
    const followerLabel =
        dict?.communityFeed?.followersLabel ||
        dict?.communityCard?.followers ||
        "Followers";

    const followerDisplay = new Intl.NumberFormat().format(
        community.followerCount,
    );

    return (
        <section className="relative overflow-hidden rounded-2xl border bg-card">
            <div className="absolute inset-0 opacity-50 blur-3xl">
                <div className="absolute -right-16 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-primary/20" />
                <div className="absolute -left-16 top-0 h-48 w-48 rounded-full bg-muted/40" />
            </div>
            <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-center">
                <div className="flex items-center gap-4">
                    <div className="relative h-24 w-24 rounded-2xl overflow-hidden">
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
                                    src={ownerProfile?.profileUrl ?? undefined}
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
    );
}
