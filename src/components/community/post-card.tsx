"use client";

import { Heart, MessageCircle, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { UIVersion } from "@/lib/consts";
import { PATHS } from "@/lib/paths";
import type { Post } from "@/services/internal/community/entities/post.entity";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";

const VERSION: UIVersion = UIVersion.B;

interface PostCardProps {
    post: Post;
}

export default function PostCard({ post }: PostCardProps) {
    const router = useRouter();

    if (VERSION === UIVersion.A) {
        return (
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="" alt={post.authorId} />
                            <AvatarFallback>
                                <User className="h-4 w-4" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="text-sm font-medium">{post.authorId}</p>
                            <p className="text-xs text-muted-foreground">
                                {new Date(post.createdAt).toLocaleDateString('en-US')}
                            </p>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <h3 className="font-semibold mb-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground overflow-hidden text-ellipsis">
                        {post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content}
                    </p>
                    {post.imageUrl && (
                        <img
                            src={post.imageUrl}
                            alt="Post image"
                            className="w-full h-48 object-cover rounded-md mt-3"
                        />
                    )}
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm">
                            <Heart className="h-4 w-4 mr-1" />
                            0
                        </Button>
                        <Button variant="ghost" size="sm">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {post.comments.length}
                        </Button>
                    </div>
                    <Badge variant="secondary">
                        Community #{post.communityId}
                    </Badge>
                </CardFooter>
            </Card>
        );
    } else if (VERSION === UIVersion.B) {
        return (
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src="" alt={post.authorId} />
                            <AvatarFallback>
                                <User className="h-5 w-5" />
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{post.authorId}</p>
                            <p className="text-sm text-muted-foreground">
                                {new Date(post.createdAt).toLocaleDateString('en-US')}
                            </p>
                        </div>
                    </div>
                    <Badge variant="outline">
                        Community #{post.communityId}
                    </Badge>
                </CardHeader>
                <CardContent>
                    <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                    <p className="text-muted-foreground overflow-hidden text-ellipsis">
                        {post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content}
                    </p>
                    {post.imageUrl && (
                        <img
                            src={post.imageUrl}
                            alt="Post image"
                            className="w-full h-48 object-cover rounded-md mt-4"
                        />
                    )}
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span>0</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.comments.length}</span>
                        </Button>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            router.push(PATHS.DASHBOARD.COMMUNITY.POST(post.id));
                        }}
                    >
                        View Post
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    // Default version (C)
    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src="" alt={post.authorId} />
                        <AvatarFallback>
                            <User className="h-5 w-5" />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium">{post.authorId}</p>
                        <p className="text-sm text-muted-foreground">
                            {new Date(post.createdAt).toLocaleDateString('en-US')}
                        </p>
                    </div>
                </div>
                <Badge variant="outline">
                    Community #{post.communityId}
                </Badge>
            </CardHeader>
            <CardContent>
                <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                <p className="text-muted-foreground overflow-hidden text-ellipsis">
                    {post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content}
                </p>
                {post.imageUrl && (
                    <img
                        src={post.imageUrl}
                        alt="Post image"
                        className="w-full h-48 object-cover rounded-md mt-4"
                    />
                )}
            </CardContent>
            <CardFooter className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>0</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments.length}</span>
                    </Button>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        router.push(PATHS.DASHBOARD.COMMUNITY.POST(post.id));
                    }}
                >
                    View Post
                </Button>
            </CardFooter>
        </Card>
    );
}