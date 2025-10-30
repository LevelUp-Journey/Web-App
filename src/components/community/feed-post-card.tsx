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

// Facebook-like image grid component
function ImageGrid({ images, title }: { images: string[]; title: string }) {
    if (images.length === 0) return null;

    const handleImageClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Could open a modal/lightbox here
    };

    // Single image - Instagram-like filling and adaptability
    if (images.length === 1) {
        return (
            <div className="relative overflow-hidden rounded-lg bg-muted/30 -ml-2 mr-2">
                <img
                    src={images[0]}
                    alt={title}
                    className="w-full h-64 md:h-80 lg:h-96 object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                    onClick={handleImageClick}
                />
            </div>
        );
    }

    // Two images - side by side, more balanced margins
    if (images.length === 2) {
        return (
            <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden bg-muted/30 -ml-1 mr-1">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`${title} ${index + 1}`}
                        className="w-full h-40 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={handleImageClick}
                    />
                ))}
            </div>
        );
    }

    // Three images - first full width, next two side by side
    if (images.length === 3) {
        return (
            <div className="space-y-1 rounded-lg overflow-hidden bg-muted/30 -ml-1 mr-1">
                <img
                    src={images[0]}
                    alt={`${title} 1`}
                    className="w-full h-48 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                    onClick={handleImageClick}
                />
                <div className="grid grid-cols-2 gap-1">
                    {images.slice(1).map((image, index) => (
                        <img
                            key={index + 1}
                            src={image}
                            alt={`${title} ${index + 2}`}
                            className="w-full h-32 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                            onClick={handleImageClick}
                        />
                    ))}
                </div>
            </div>
        );
    }

    // Four or more images - 2x2 grid with overlay for extra images
    return (
        <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden bg-muted/30 -ml-1 mr-1">
            {images.slice(0, 4).map((image, index) => (
                <div key={index} className="relative">
                    <img
                        src={image}
                        alt={`${title} ${index + 1}`}
                        className="w-full h-32 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={handleImageClick}
                    />
                    {index === 3 && images.length > 4 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer hover:opacity-95 transition-opacity" onClick={handleImageClick}>
                            <span className="text-white font-semibold text-lg">
                                +{images.length - 4}
                            </span>
                        </div>
                    )}
                </div>
            ))}
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
        <Card className="overflow-hidden w-full hover:bg-muted/30 transition-colors cursor-pointer border-0 shadow-sm" onClick={handleCommentsClick}>
            <CardContent className="p-4">
                {/* Post Header */}
                <div className="flex items-start space-x-3 mb-3">
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
                <div className="space-y-3 ml-11">
                    <h3 className="text-base font-semibold leading-tight">{post.title}</h3>
                    <p className="text-sm text-muted-foreground leading-snug line-clamp-3">
                        {post.content.length > 150 
                            ? `${post.content.slice(0, 150)}...` 
                            : post.content}
                    </p>

                    {/* Images - Facebook-like grid */}
                    {(post.imageUrl || (post.imageUrls && post.imageUrls.length > 0)) && (
                        <div className="mt-3">
                            <ImageGrid
                                images={post.imageUrls && post.imageUrls.length > 0 ? post.imageUrls : (post.imageUrl ? [post.imageUrl] : [])}
                                title={post.title}
                            />
                        </div>
                    )}

                    {/* Post Actions - Cohesive unit */}
                    <div className="flex items-center pt-3">
                        <div className="flex items-center bg-muted/20 rounded-full px-2 py-1 space-x-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleReaction();
                                }}
                                disabled={isLoading}
                                className={`h-7 text-xs hover:bg-transparent ${userReaction ? "text-red-500" : "text-muted-foreground"}`}
                            >
                                <Heart
                                    className={`h-3.5 w-3.5 mr-1 ${userReaction ? "fill-current" : ""}`}
                                />
                                {reactionCount}
                            </Button>
                            <div className="w-px h-4 bg-muted-foreground/20"></div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-muted-foreground hover:bg-transparent"
                            >
                                <MessageCircle className="h-3.5 w-3.5 mr-1" />
                                {post.comments?.length || 0}
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
