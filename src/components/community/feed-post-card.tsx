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

// Adapted from Magic UI Tweet Card structure
interface FeedPostCardProps {
    post: PostWithDetails;
}

// Twitter-style image grid component
function ImageGrid({ images, title }: { images: string[]; title: string }) {
    if (images.length === 0) return null;

    const handleImageClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Could open a modal/lightbox here
    };

    // Single image - Twitter rounded style
    if (images.length === 1) {
        return (
            <div className="relative overflow-hidden rounded-xl border shadow-sm">
                <img
                    src={images[0]}
                    alt={title}
                    className="w-full h-auto max-h-64 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                    onClick={handleImageClick}
                />
            </div>
        );
    }

    // Multiple images - Twitter horizontal scroll style
    return (
        <div className="relative flex transform-gpu snap-x snap-mandatory gap-4 overflow-x-auto">
            <div className="shrink-0 snap-center w-2" />
            {images.map((image, index) => (
                <img
                    key={index}
                    src={image}
                    alt={`${title} ${index + 1}`}
                    className="h-64 w-5/6 shrink-0 snap-center snap-always rounded-xl border object-cover shadow-sm cursor-pointer hover:opacity-95 transition-opacity"
                    onClick={handleImageClick}
                />
            ))}
            <div className="shrink-0 snap-center w-2" />
        </div>
    );
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
        <Card className="relative flex h-fit w-full flex-col gap-2 overflow-hidden rounded-lg border p-4 backdrop-blur-md hover:bg-muted/30 transition-colors cursor-pointer" onClick={handleCommentsClick}>
            {/* Tweet-like Header - Adapted from Magic UI TweetHeader */}
            <div className="flex flex-row justify-between tracking-tight">
                <div className="flex items-center space-x-2">
                    <div
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={handleAuthorClick}
                    >
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={post.authorProfile?.profileUrl} />
                            <AvatarFallback>
                                {post.authorProfile?.username
                                    ?.charAt(0)
                                    .toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div>
                        <div
                            className="flex items-center font-semibold whitespace-nowrap cursor-pointer hover:underline"
                            onClick={handleAuthorClick}
                        >
                            {post.authorProfile?.username || "Unknown User"}
                        </div>
                        <div className="flex items-center space-x-1">
                            <span className="text-sm text-gray-500 transition-all duration-75">
                                @{post.authorProfile?.username || "unknown"}
                            </span>
                            <span className="text-gray-500">·</span>
                            <span className="text-sm text-gray-500">
                                {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
                <div
                    className="cursor-pointer"
                    onClick={handleCommunityClick}
                >
                    <Badge variant="outline" className="text-xs">
                        {post.community?.name || "Unknown Community"}
                    </Badge>
                </div>
            </div>

            {/* Tweet-like Body - Adapted from Magic UI TweetBody */}
            <div className="leading-normal tracking-tighter break-words">
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold">{post.title}</h3>
                    <p className="text-sm font-normal text-gray-700 dark:text-gray-300">
                        {post.content.length > 200
                            ? `${post.content.slice(0, 200)}...`
                            : post.content}
                    </p>
                </div>
            </div>

            {/* Tweet-like Media - Adapted from Magic UI TweetMedia */}
            {(post.imageUrl || (post.imageUrls && post.imageUrls.length > 0)) && (
                <div className="flex flex-1 items-center justify-center">
                    <ImageGrid
                        images={post.imageUrls && post.imageUrls.length > 0 ? post.imageUrls : (post.imageUrl ? [post.imageUrl] : [])}
                        title={post.title}
                    />
                </div>
            )}

            {/* Action Buttons - Twitter style */}
            <div className="flex items-center justify-between max-w-md pt-2 border-t">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleReaction();
                    }}
                    disabled={isLoading}
                    className={`h-8 px-3 text-xs hover:bg-red-50 hover:text-red-500 ${userReaction ? "text-red-500" : "text-muted-foreground"}`}
                >
                    <Heart
                        className={`h-4 w-4 mr-2 ${userReaction ? "fill-current" : ""}`}
                    />
                    {reactionCount}
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-xs text-muted-foreground hover:bg-blue-50 hover:text-blue-500"
                >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {post.comments?.length || 0}
                </Button>
            </div>
        </Card>
    );
}
