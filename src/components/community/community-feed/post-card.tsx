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
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useReactions } from "@/hooks/use-reactions";
import {
    REACTION_TYPES,
    type ReactionType,
} from "@/services/internal/community/entities/reaction.entity";
import type { Post } from "@/services/internal/community/entities/post.entity";
import type { UserResponse } from "@/services/internal/users/controller/user.response";
import { MarkdownContent } from "./markdown-content";

interface PostCardProps {
    post: Post;
    dict: Dictionary;
    formatDate: (date: string | Date) => string;
    author?: UserResponse | null;
    currentUserId?: string;
}

export function PostCard({
    post,
    dict,
    formatDate,
    author,
    currentUserId,
}: PostCardProps) {
    const canReact = Boolean(currentUserId);

    const initialCounts = {
        postId: post.postId,
        counts: post.reactions?.reactionCounts ?? {},
        totalCount: Object.values(post.reactions?.reactionCounts ?? {}).reduce(
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
    } = useReactions(post.postId, {
        initialCounts,
        initialUserReaction: post.reactions?.userReaction,
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
                <div className="flex items-center gap-3">
                    <Avatar className="rounded-lg">
                        <AvatarImage
                            src={author?.profileUrl ?? post.authorProfileUrl ?? undefined}
                            alt={author?.username || post.authorName || "User"}
                        />
                        <AvatarFallback>
                            {author?.username?.slice(0, 2).toUpperCase() ||
                                post.authorName?.slice(0, 2).toUpperCase() ||
                                "??"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">
                                {author?.username || post.authorName || "Unknown User"}
                            </span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground">
                                {formatDate(post.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <MarkdownContent content={post.content} />

                {post.images && post.images.length > 0 && (
                    <div className="space-y-2">
                        {post.images.map((image, index) => (
                            <div
                                key={index}
                                className="relative rounded-lg overflow-hidden border min-h-[200px] w-full"
                            >
                                <Image
                                    src={image}
                                    alt={`Post image ${index + 1}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 600px"
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-1">
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
