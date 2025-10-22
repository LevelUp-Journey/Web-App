"use client";

import { Heart, MessageCircle, User } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Post } from "@/services/internal/community/entities/post.entity";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { PATHS } from "@/lib/paths";

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    const router = useRouter();
    const date = new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    const content = post.content.length > 150 
        ? `${post.content.substring(0, 150)}...` 
        : post.content;

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src="" alt={post.authorId} />
                            <AvatarFallback>
                                <User className="h-5 w-5" />
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{post.authorId}</p>
                            <p className="text-sm text-muted-foreground">{date}</p>
                        </div>
                    </div>
                    <Badge variant="outline">Community #{post.communityId}</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                <p className="text-muted-foreground">{content}</p>
                {post.imageUrl && (
                    <img
                        src={post.imageUrl}
                        alt="Post"
                        className="w-full h-48 object-cover rounded-md mt-4"
                    />
                )}
            </CardContent>
            <CardFooter className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                        <Heart className="h-4 w-4 mr-1" />
                        0
                    </Button>
                    <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post.comments.length}
                    </Button>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(PATHS.DASHBOARD.COMMUNITY.POST(post.id))}
                >
                    View
                </Button>
            </CardFooter>
        </Card>
    );
}

export default PostCard;
