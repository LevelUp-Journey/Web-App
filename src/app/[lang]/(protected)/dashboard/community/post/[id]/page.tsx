"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Heart, MessageCircle, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PostController } from "@/services/internal/community/controller/post.controller";
import { ProfileController } from "@/services/internal/profiles/controller/profile.controller";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import { useReactions } from "@/hooks/use-reactions";
import type { Post } from "@/services/internal/community/entities/post.entity";
import type { ProfileResponse } from "@/services/internal/profiles/controller/profile.response";

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
    const { userReaction: postUserReaction, isLoading: reactionLoading, toggleReaction, reactionCount } = useReactions(postId);

    useEffect(() => {
        const loadPost = async () => {
            try {
                setLoading(true);

                // Get the post
                const allPosts = await PostController.getAllPosts();
                const foundPost = allPosts.find(p => p.id === postId);

                if (!foundPost) {
                    setError("Post not found");
                    return;
                }

                // Get author profile
                const authorProfile = await ProfileController.getProfileByUserId(foundPost.authorId);

                // Get community
                const community = await CommunityController.getCommunityById(foundPost.communityId);

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
                        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back
                        </Button>
                        <div className="text-center space-y-4">
                            <h1 className="text-xl font-semibold">{error || "Post not found"}</h1>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const date = new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <div className="w-full h-full overflow-y-auto">
            <div className="container mx-auto p-6">
                <div className="space-y-6">
                    <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>

                    {/* Post Header */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={post.authorProfile?.profileUrl} alt={post.authorProfile?.username || "User"} />
                                        <AvatarFallback>
                                            {post.authorProfile?.firstName?.[0] || post.authorProfile?.username?.[0] || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">
                                            {post.authorProfile ? `${post.authorProfile.firstName} ${post.authorProfile.lastName}` : "Unknown User"}
                                        </p>
                                        <p className="text-sm text-muted-foreground">@{post.authorProfile?.username || "unknown"}</p>
                                        <p className="text-xs text-muted-foreground">{date}</p>
                                    </div>
                                </div>
                                <Badge variant="outline">{post.community?.name || "Community"}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <h1 className="text-2xl font-bold">{post.title}</h1>
                            <p className="text-muted-foreground leading-relaxed">{post.content}</p>
                            {post.imageUrl && (
                                <img
                                    src={post.imageUrl}
                                    alt="Post"
                                    className="w-full max-w-2xl mx-auto rounded-md"
                                />
                            )}
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleReaction}
                                    disabled={reactionLoading}
                                    className={postUserReaction ? "text-red-500" : ""}
                                >
                                    <Heart className={`h-4 w-4 mr-2 ${postUserReaction ? "fill-current" : ""}`} />
                                    {reactionCount} Likes
                                </Button>
                                <Button variant="ghost" size="sm">
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    {post.comments.length} Comments
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Comments Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Comments ({post.comments.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {post.comments.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">
                                    No comments yet. Be the first to comment!
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {post.comments.map((comment, index) => (
                                        <div key={index} className="border-b pb-4 last:border-b-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarFallback className="text-xs">U</AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm font-medium">Anonymous User</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm">{comment.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}