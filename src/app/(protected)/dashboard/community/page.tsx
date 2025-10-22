"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Users, MessageSquare, Heart, MessageCircle, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PostController } from "@/services/internal/community/controller/post.controller";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import { ProfileController } from "@/services/internal/profiles/controller/profile.controller";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import type { Post } from "@/services/internal/community/entities/post.entity";
import type { Community } from "@/services/internal/community/entities/community.entity";

interface PostWithDetails extends Post {
    authorProfile?: {
        username: string;
        profileUrl?: string;
        firstName?: string;
        lastName?: string;
    };
    community?: Community;
}

export default function CommunityFeedPage() {
    const router = useRouter();
    const [posts, setPosts] = useState<PostWithDetails[]>([]);
    const [communities, setCommunities] = useState<Community[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                // Get all posts
                const allPosts = await PostController.getAllPosts();

                // Get all communities for mapping
                const allCommunities = await CommunityController.getCommunities();
                setCommunities(allCommunities);

                // Create a map of community ID to community
                const communityMap = new Map(allCommunities.map(c => [c.id, c]));

                // Get unique author IDs
                const authorIds = [...new Set(allPosts.map(p => p.authorId))];

                // Get profiles for all authors
                const profilePromises = authorIds.map(async (authorId) => {
                    try {
                        const profile = await ProfileController.getProfileByUserId(authorId);
                        return { authorId, profile };
                    } catch (error) {
                        console.error(`Error loading profile for ${authorId}:`, error);
                        return { authorId, profile: { username: "Unknown User" } };
                    }
                });

                const profiles = await Promise.all(profilePromises);
                const profileMap = new Map(profiles.map(p => [p.authorId, p.profile]));

                // Combine posts with details
                const postsWithDetails: PostWithDetails[] = allPosts.map(post => ({
                    ...post,
                    authorProfile: profileMap.get(post.authorId),
                    community: communityMap.get(post.communityId),
                }));

                // Sort by creation date (newest first)
                postsWithDetails.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                setPosts(postsWithDetails);

            } catch (err) {
                console.error("Error loading feed:", err);
                setError("Failed to load community feed");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-full overflow-y-auto">
                <div className="container mx-auto p-6">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <p className="text-muted-foreground">Loading community feed...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full overflow-y-auto">
                <div className="container mx-auto p-6">
                    <div className="text-center space-y-4">
                        <h1 className="text-xl font-semibold">Error</h1>
                        <p className="text-muted-foreground">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full overflow-y-auto">
            <div className="container mx-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Feed</h1>
                        <p className="text-muted-foreground">
                            Discover posts from all communities
                        </p>
                    </div>
                    <Button onClick={() => router.push("/dashboard/community/posts/create")}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Post
                    </Button>
                </div>

                {/* Posts Feed */}
                <div className="space-y-6">
                    {posts.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                                <p className="text-muted-foreground mb-4">
                                    Be the first to share something in the community!
                                </p>
                                <Button onClick={() => router.push("/dashboard/community/posts/create")}>
                                    Create First Post
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        posts.map((post) => (
                            <Card key={post.id} className="overflow-hidden">
                                <CardContent className="p-6">
                                    {/* Post Header */}
                                    <div className="flex items-start space-x-3 mb-4">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={post.authorProfile?.profileUrl} />
                                            <AvatarFallback>
                                                {post.authorProfile?.username?.charAt(0).toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-semibold">
                                                    {post.authorProfile?.username || "Unknown User"}
                                                </span>
                                                <span className="text-muted-foreground">in</span>
                                                <Badge variant="outline" className="text-xs">
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
                                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
                                            <Heart className="h-4 w-4 mr-2" />
                                            Like
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blue-500">
                                            <MessageCircle className="h-4 w-4 mr-2" />
                                            Comment ({post.comments?.length || 0})
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-green-500">
                                            <Share className="h-4 w-4 mr-2" />
                                            Share
                                        </Button>
                                    </div>

                                    {/* Comments Preview */}
                                    {post.comments && post.comments.length > 0 && (
                                        <div className="mt-4 space-y-3">
                                            <h4 className="text-sm font-semibold text-muted-foreground">
                                                Recent Comments
                                            </h4>
                                            {post.comments.slice(0, 2).map((comment) => (
                                                <div key={comment.id} className="bg-muted/50 rounded-lg p-3">
                                                    <p className="text-sm">{comment.content}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {new Date(comment.createdAt).toLocaleDateString()}
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
                        ))
                    )}
                </div>
            </div>
        </div>
        </div>
    );
}
