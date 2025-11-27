"use client";

import {
    Angry,
    Frown,
    Heart,
    Laugh,
    Sparkles,
    ThumbsUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useReactions } from "@/hooks/use-reactions";
import { REACTION_TYPES, type ReactionType } from "@/services/internal/community/entities/reaction.entity";
import { cn } from "@/lib/utils";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import type { FeedItem } from "@/hooks/use-personalized-feed";
import { MarkdownContent } from "./community-feed/markdown-content";

interface FeedPostCardProps {
    feedItem: FeedItem;
    dict: Dictionary;
    currentUserId?: string;
    formatDate: (date: string | Date) => string;
}

export function FeedPostCard({
    feedItem,
    dict,
    currentUserId = "",
    formatDate,
}: FeedPostCardProps) {
    const PATHS = useLocalizedPaths();
    const canReact = Boolean(currentUserId);

    const initialCounts = {
        postId: feedItem.id,
        counts: feedItem.reactions?.reactionCounts ?? {},
        totalCount: Object.values(feedItem.reactions?.reactionCounts ?? {}).reduce(
            (acc, value) => acc + (value ?? 0),
            0,
        ),
    };

    const {
        reactionCounts,
        userReaction,
        isLoading,
        react,
        reactionCount,
    } = useReactions(feedItem.id, {
        initialCounts,
        initialUserReaction: feedItem.reactions?.userReaction,
    });

    const reactionOptions: Record<
        ReactionType,
        {
            label: string;
            icon: typeof ThumbsUp;
            color: string;
        }
    > = {
        like: {
            label: "Me gusta",
            icon: ThumbsUp,
            color: "#2563eb",
        },
        love: {
            label: "Me encanta",
            icon: Heart,
            color: "#ef4444",
        },
        haha: {
            label: "Me divierte",
            icon: Laugh,
            color: "#fbbf24",
        },
        wow: {
            label: "Me asombra",
            icon: Sparkles,
            color: "#a855f7",
        },
        sad: {
            label: "Me entristece",
            icon: Frown,
            color: "#3b82f6",
        },
        angry: {
            label: "Me enoja",
            icon: Angry,
            color: "#f97316",
        },
    };

    const activeReaction = userReaction ? reactionOptions[userReaction] : null;

    return (
        <Card className="border-muted">
            <CardHeader className="gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="rounded-lg">
                            <AvatarImage
                                src={feedItem.authorProfileUrl ?? undefined}
                                alt={feedItem.authorName}
                            />
                            <AvatarFallback>
                                {feedItem.authorName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <CardDescription className="text-xs">
                                    {feedItem.authorName} ·{" "}
                                    {formatDate(feedItem.createdAt)}
                                </CardDescription>
                            </div>
                            <Link
                                href={`${PATHS.DASHBOARD.COMMUNITY.ROOT}/${feedItem.communityId}`}
                                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                            >
                                {feedItem.communityImageUrl && (
                                    <Avatar className="size-5 rounded-md">
                                        <AvatarImage
                                            src={feedItem.communityImageUrl}
                                            alt={feedItem.communityName}
                                        />
                                        <AvatarFallback className="text-[10px]">
                                            {feedItem.communityName
                                                .slice(0, 2)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                                <Badge
                                    variant="secondary"
                                    className="text-xs font-normal"
                                >
                                    {feedItem.communityName}
                                </Badge>
                            </Link>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <MarkdownContent content={feedItem.content} />

                {feedItem.imageUrl && (
                    <div className="relative rounded-lg overflow-hidden border min-h-[200px] w-full">
                        <Image
                            src={feedItem.imageUrl}
                            alt="Post image"
                            fill
                            sizes="(max-width: 768px) 100vw, 600px"
                            className="object-cover"
                        />
                    </div>
                )}

                {/* Reactions Section */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                    <div className="flex items-center gap-2">
                        <Button
                            variant={activeReaction ? "default" : "outline"}
                            size="sm"
                            onClick={() => void react("like")}
                            disabled={isLoading || !canReact}
                            className="gap-2"
                        >
                            {(() => {
                                const Icon =
                                    activeReaction?.icon ?? reactionOptions.like.icon;
                                const color =
                                    activeReaction?.color ?? reactionOptions.like.color;
                                return (
                                    <Icon
                                        className={cn(
                                            "size-4",
                                            activeReaction ? "transition-transform" : "",
                                        )}
                                        style={{ color }}
                                    />
                                );
                            })()}
                            <span className="text-xs font-medium">
                                {activeReaction?.label ||
                                    dict?.communityFeed?.react ||
                                    "Reaccionar"}
                            </span>
                            <Badge variant="secondary" className="text-[11px] px-2">
                                {reactionCount}
                            </Badge>
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9"
                                    disabled={isLoading || !canReact}
                                    aria-label="Elegir reacción"
                                >
                                    <Sparkles className="size-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56">
                                <DropdownMenuLabel>
                                    {dict?.communityFeed?.react || "Elige tu reacción"}
                                </DropdownMenuLabel>
                                <div className="grid grid-cols-3 gap-2 p-2">
                                    {REACTION_TYPES.map((type) => {
                                        const option = reactionOptions[type];
                                        const Icon = option.icon;
                                        const isActive = userReaction === type;
                                        const count = reactionCounts?.counts?.[type] ?? 0;

                                        return (
                                            <DropdownMenuItem
                                                key={type}
                                                className="flex flex-col items-center gap-1 px-2 py-2"
                                                onClick={() => void react(type)}
                                            >
                                                <div
                                                    className={cn(
                                                        "flex size-10 items-center justify-center rounded-full border",
                                                        isActive
                                                            ? "border-primary bg-primary/10"
                                                            : "border-border bg-muted/60",
                                                    )}
                                                    style={{ color: option.color }}
                                                >
                                                    <Icon className="size-5" />
                                                </div>
                                                <span className="text-[11px] text-center leading-tight">
                                                    {option.label}
                                                </span>
                                                {count > 0 && (
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {count}
                                                    </span>
                                                )}
                                            </DropdownMenuItem>
                                        );
                                    })}
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => void react(userReaction ?? "like")}
                                >
                                    {userReaction
                                        ? dict?.communityFeed?.removeReaction ||
                                          "Quitar reacción"
                                        : dict?.communityFeed?.react || "Reaccionar"}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {REACTION_TYPES.filter(
                            (type) => (reactionCounts?.counts?.[type] ?? 0) > 0,
                        ).map((type) => {
                            const option = reactionOptions[type];
                            const Icon = option.icon;
                            const count = reactionCounts?.counts?.[type] ?? 0;
                            return (
                                <Badge
                                    key={type}
                                    variant="secondary"
                                    className="flex items-center gap-1 text-[11px]"
                                >
                                    <Icon className="size-4" style={{ color: option.color }} />
                                    {count}
                                </Badge>
                            );
                        })}

                        {reactionCount === 0 && (
                            <span className="text-xs text-muted-foreground">
                                Sé el primero en reaccionar
                            </span>
                        )}
                        {!canReact && (
                            <span className="text-xs text-muted-foreground">
                                Inicia sesión para reaccionar
                            </span>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
