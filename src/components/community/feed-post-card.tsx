"use client";

import { Heart, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useReactions } from "@/hooks/use-reactions";
import type { Post } from "@/services/internal/community/entities/post.entity";
import type { Community } from "@/services/internal/community/entities/community.entity";

interface PostWithDetails extends Post {
    authorProfile?: {
        username: string;
        profileUrl?: string;
        firstName?: string;
        lastName?: string;
    };
    authorProfileId?: string;
    community?: Community;
}

interface FeedPostCardProps {
    post: PostWithDetails;
}

export function FeedPostCard({ post }: FeedPostCardProps) {
    const router = useRouter();
    const { userReaction, isLoading, toggleReaction, reactionCount } =
        useReactions(post.id);

    const handleAuthorClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (post.authorProfileId) {
            router.push(`/dashboard/profile/${post.authorProfileId}`);
        }
    };

    const handleCommunityClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (post.community?.id) {
            router.push(`/dashboard/community/${post.community.id}`);
        }
    };

    const handleCommentsClick = () => {
        router.push(`/dashboard/community/post/${post.id}`);
    };

    return (
        <Card className="overflow-hidden w-full hover:bg-muted/30 transition-colors cursor-pointer" onClick={handleCommentsClick}>
            <CardContent className="p-3">
                {/* Post Header */}
                <div className="flex items-start space-x-2 mb-2">
                    <Avatar
                        className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={handleAuthorClick}
                    >
                        <AvatarImage src={post.authorProfile?.profileUrl} />
                        <AvatarFallback>
                            {post.authorProfile?.username
                                ?.charAt(0)
                                .toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 flex-wrap">
                            <span
                                className="font-semibold text-sm cursor-pointer hover:underline"
                                onClick={handleAuthorClick}
                            >
                                {post.authorProfile?.username || "Unknown User"}
                            </span>
                            <span className="text-muted-foreground text-xs">·</span>
                            <Badge
                                variant="outline"
                                className="text-xs cursor-pointer h-5"
                                onClick={handleCommunityClick}
                            >
                                {post.community?.name || "Unknown Community"}
                            </Badge>
                            <span className="text-muted-foreground text-xs">·</span>
                            <span className="text-xs text-muted-foreground">
                                {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Post Content */}
                <div className="space-y-2 ml-10">
                    <h3 className="text-base font-semibold leading-tight">{post.title}</h3>
                    <p className="text-sm text-muted-foreground leading-snug line-clamp-3">
                        {post.content.length > 150 
                            ? `${post.content.slice(0, 150)}...` 
                            : post.content}
                    </p>

                    {post.imageUrl && (
                        <div className="mt-2 -mx-2">
                            <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="w-full max-h-80 object-cover rounded-lg"
                            />
                        </div>
                    )}

                    {/* Post Actions - Horizontal */}
                    <div className="flex items-center space-x-4 pt-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleReaction();
                            }}
                            disabled={isLoading}
                            className={`h-8 text-xs ${userReaction ? "text-red-500" : "text-muted-foreground"}`}
                        >
                            <Heart
                                className={`h-3.5 w-3.5 mr-1.5 ${userReaction ? "fill-current" : ""}`}
                            />
                            {reactionCount}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs text-muted-foreground"
                        >
                            <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                            {post.comments?.length || 0}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
