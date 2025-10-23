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
        <Card className="overflow-hidden w-full">
            <CardContent className="p-6">
                {/* Post Header */}
                <div className="flex items-start space-x-3 mb-4">
                    <Avatar
                        className="h-10 w-10 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={handleAuthorClick}
                    >
                        <AvatarImage src={post.authorProfile?.profileUrl} />
                        <AvatarFallback>
                            {post.authorProfile?.username
                                ?.charAt(0)
                                .toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex items-center space-x-2">
                            <span
                                className="font-semibold cursor-pointer"
                                onClick={handleAuthorClick}
                            >
                                {post.authorProfile?.username || "Unknown User"}
                            </span>
                            <span className="text-muted-foreground">in</span>
                            <Badge
                                variant="outline"
                                className="text-xs cursor-pointer"
                                onClick={handleCommunityClick}
                            >
                                {post.community?.name || "Unknown Community"}
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Post Content */}
                <div className="space-y-3">
                    <h3 className="text-xl font-semibold">{post.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        {post.content}
                    </p>

                    {post.imageUrl && (
                        <div className="mt-4">
                            <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="w-full max-h-96 object-cover rounded-lg"
                            />
                        </div>
                    )}
                </div>

                {/* Post Actions */}
                <div className="flex items-center space-x-6 mt-6 pt-4 border-t">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleReaction}
                        disabled={isLoading}
                        className={userReaction ? "text-red-500" : ""}
                    >
                        <Heart
                            className={`h-4 w-4 mr-2 ${userReaction ? "fill-current" : ""}`}
                        />
                        {reactionCount}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCommentsClick}
                    >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {post.comments?.length || 0}
                    </Button>
                </div>

                {/* Comments Preview */}
                {post.comments && post.comments.length > 0 && (
                    <div className="mt-4 space-y-3">
                        <h4 className="text-sm font-semibold text-muted-foreground">
                            Recent Comments
                        </h4>
                        {post.comments.slice(0, 2).map((comment) => (
                            <div
                                key={comment.id}
                                className="bg-muted/50 rounded-lg p-3"
                            >
                                <p className="text-sm">{comment.content}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(
                                        comment.createdAt,
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                        {post.comments.length > 2 && (
                            <p className="text-sm text-muted-foreground">
                                View all {post.comments.length} comments
                            </p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
