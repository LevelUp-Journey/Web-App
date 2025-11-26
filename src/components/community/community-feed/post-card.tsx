"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import type { Post } from "@/services/internal/community/entities/post.entity";
import { UserController } from "@/services/internal/users/controller/user.controller";
import type { UserResponse } from "@/services/internal/users/controller/user.response";

interface PostCardProps {
    post: Post;
    dict: Dictionary;
    formatDate: (date: string | Date) => string;
}

export function PostCard({ post, dict, formatDate }: PostCardProps) {
    const [author, setAuthor] = useState<UserResponse | null>(null);
    const [loadingAuthor, setLoadingAuthor] = useState(true);

    useEffect(() => {
        const loadAuthor = async () => {
            try {
                const authorData = await UserController.getUserById(post.authorId);
                setAuthor(authorData);
            } catch (error) {
                console.error("Failed to load author:", error);
            } finally {
                setLoadingAuthor(false);
            }
        };

        loadAuthor();
    }, [post.authorId]);

    return (
        <Card className="border-muted">
            <CardHeader className="gap-4">
                <div className="flex items-center gap-3">
                    <Avatar className="rounded-lg">
                        <AvatarImage
                            src={author?.profileUrl}
                            alt={author?.username || "User"}
                        />
                        <AvatarFallback>
                            {author?.username?.slice(0, 2).toUpperCase() || "??"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">
                                {author?.username || "Unknown User"}
                            </span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground">
                                {formatDate(post.createdAt)}
                            </span>
                        </div>
                        {post.type === "announcement" && (
                            <div className="text-xs text-blue-600 font-medium mt-1">
                                📢 Announcement
                            </div>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div className="whitespace-pre-wrap">{post.content}</div>
                </div>

                {post.images && post.images.length > 0 && (
                    <div className="space-y-2">
                        {post.images.map((image, index) => (
                            <div key={index} className="relative rounded-lg overflow-hidden border min-h-[200px] w-full">
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
            </CardContent>
        </Card>
    );
}
