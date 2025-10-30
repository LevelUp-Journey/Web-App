"use client";

import { ArrowLeft, Heart, MessageCircle, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReactions } from "@/hooks/use-reactions";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import { PostController } from "@/services/internal/community/controller/post.controller";
import type { Post } from "@/services/internal/community/entities/post.entity";
import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";
import type { ProfileResponse } from "@/services/internal/profiles/profiles/controller/profile.response";

interface PostWithDetails extends Post {
    authorProfile?: ProfileResponse;
    community?: {
        id: string;
        name: string;
        description: string;
    };
}

export default function PostPage() {
    const params = useParams();
    const router = useRouter();
    const postId = params.id as string;
    const [post, setPost] = useState<PostWithDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const {
        userReaction: postUserReaction,
        isLoading: reactionLoading,
        toggleReaction,
        reactionCount,
    } = useReactions(postId);

    useEffect(() => {
        const loadPost = async () => {
            try {
                setLoading(true);

                // Get the post
                const allPosts = await PostController.getAllPosts();
                const foundPost = allPosts.find((p) => p.id === postId);

                if (!foundPost) {
                    setError("Post not found");
                    return;
                }

                // Get author profile
                const authorProfile =
                    await ProfileController.getProfileByUserId(
                        foundPost.authorId,
                    );

                // Get community
                const community = await CommunityController.getCommunityById(
                    foundPost.communityId,
                );

                setPost({
                    ...foundPost,
                    authorProfile,
                    community,
                });
            } catch (err) {
                console.error("Error loading post:", err);
                setError("Failed to load post");
            } finally {
                setLoading(false);
            }
        };

        if (postId) loadPost();
    }, [postId]);

    if (loading) {
        return (
            <div className="w-full h-full overflow-y-auto">
                <div className="container mx-auto p-6">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <p className="text-muted-foreground">Loading post...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="w-full h-full overflow-y-auto">
                <div className="container mx-auto p-6">
                    <div className="space-y-6">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.back()}
                            className="mb-4"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back
                        </Button>
                        <div className="text-center space-y-4">
                            <h1 className="text-xl font-semibold">
                                {error || "Post not found"}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const date = new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div className="w-full h-full overflow-y-auto bg-muted/20">
            {/* Back Button */}
            <div className="container mx-auto px-4 pt-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 pb-4">
                <div className="max-w-2xl mx-auto">

                    {/* Post Content - Twitter Style */}
                    <div className="bg-background rounded-lg border p-6">
                        {/* Post Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3 flex-1">
                                <Avatar className="h-12 w-12 mt-1 flex-shrink-0">
                                    <AvatarImage
                                        src={post.authorProfile?.profileUrl}
                                        alt={
                                            post.authorProfile?.username ||
                                            "User"
                                        }
                                    />
                                    <AvatarFallback>
                                        {post.authorProfile
                                            ?.firstName?.[0] ||
                                            post.authorProfile
                                                ?.username?.[0] ||
                                            "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <p className="font-semibold text-base">
                                            {post.authorProfile
                                                ? `${post.authorProfile.firstName} ${post.authorProfile.lastName}`
                                                : "Unknown User"}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            @
                                            {post.authorProfile?.username ||
                                                "unknown"}
                                        </p>
                                        <span className="text-muted-foreground hidden sm:inline">·</span>
                                        <p className="text-sm text-muted-foreground">
                                            {date}
                                        </p>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                        {post.community?.name || "Community"}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Post Body */}
                        <div className="mb-4">
                            <h1 className="text-xl font-bold mb-3">{post.title}</h1>
                            <p className="text-foreground leading-relaxed mb-4">
                                {post.content}
                            </p>
                            {post.imageUrl && (
                                <div className="rounded-2xl overflow-hidden border mb-4 w-full">
                                    <img
                                        src={post.imageUrl}
                                        alt="Post"
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Actions - Twitter Style */}
                        <div className="flex items-center justify-between w-full pt-3 border-t border-border/50">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleReaction}
                                disabled={reactionLoading}
                                className={`h-9 px-4 text-sm hover:bg-red-50 hover:text-red-500 rounded-full ${postUserReaction ? "text-red-500" : "text-muted-foreground"}`}
                            >
                                <Heart
                                    className={`h-5 w-5 mr-2 ${postUserReaction ? "fill-current" : ""}`}
                                />
                                {reactionCount}
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 px-4 text-sm text-muted-foreground hover:bg-blue-50 hover:text-blue-500 rounded-full"
                            >
                                <MessageCircle className="h-5 w-5 mr-2" />
                                {post.comments.length}
                            </Button>
                        </div>

                        {/* Comments Section - Inside Post Container */}
                        <div className="mt-6 pt-4 border-t border-border/30">
                            <h3 className="text-lg font-semibold mb-4">
                                Comments ({post.comments.length})
                            </h3>

                            {post.comments.length === 0 ? (
                                <div className="text-center py-8">
                                    <MessageCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                                    <p className="text-muted-foreground text-sm">
                                        No comments yet. Be the first to comment!
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {post.comments.map((comment, index) => (
                                        <div
                                            key={index}
                                            className="flex gap-3 py-3 last:pb-0 border-b border-border/20 last:border-b-0"
                                        >
                                            <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                                                <AvatarFallback className="text-xs">
                                                    U
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-medium">
                                                        Anonymous User
                                                    </span>
                                                    <span className="text-muted-foreground">·</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(
                                                            comment.createdAt,
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-foreground leading-relaxed">
                                                    {comment.content}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
