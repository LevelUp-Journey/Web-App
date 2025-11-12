"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { PostController } from "@/services/internal/community/controller/post.controller";
import { CommentsSection } from "./comments-section";
import { MarkdownContent } from "./markdown-content";
import type { Dictionary } from "@/app/[lang]/dictionaries";

interface Post {
    id: string;
    content: string;
    imageUrl?: string | null;
    createdAt: string;
    authorProfile?: any;
    comments: any[];
    commentProfiles?: Record<string, any>;
}

interface PostCardProps {
    post: Post;
    dict: Dictionary;
    isAdmin?: boolean;
    onPostDeleted?: () => void;
    getDisplayName: (profile: any) => string;
    getInitials: (profile: any, fallback: string) => string;
    formatDate: (date: string | Date) => string;
}

export function PostCard({
    post,
    dict,
    isAdmin = false,
    onPostDeleted,
    getDisplayName,
    getInitials,
    formatDate,
}: PostCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm(dict?.communityFeed?.confirmDelete || "Are you sure you want to delete this post?")) {
            return;
        }

        try {
            setIsDeleting(true);
            await PostController.deletePost(post.id);
            onPostDeleted?.();
        } catch (error) {
            console.error("Error deleting post:", error);
            alert(dict?.communityFeed?.deleteError || "Failed to delete post. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Card className="border-muted">
            <CardHeader className="gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage
                                src={post.authorProfile?.profileUrl ?? undefined}
                                alt={getDisplayName(post.authorProfile)}
                            />
                            <AvatarFallback>
                                {getInitials(
                                    post.authorProfile,
                                    post.content,
                                )}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <CardDescription className="text-xs">
                                {getDisplayName(post.authorProfile)} ·{" "}
                                {formatDate(post.createdAt)}
                            </CardDescription>
                        </div>
                    </div>
                    {isAdmin && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                            {isDeleting ? (
                                <Spinner className="size-4" />
                            ) : (
                                <Trash2 className="size-4" />
                            )}
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <MarkdownContent content={post.content} />

                {post.imageUrl && (
                    <div className="relative rounded-lg overflow-hidden border min-h-[200px] w-full">
                        <Image
                            src={post.imageUrl}
                            alt="Post image"
                            fill
                            sizes="(max-width: 768px) 100vw, 600px"
                            className="object-cover"
                        />
                    </div>
                )}

                <Separator />

                <CommentsSection
                    comments={post.comments}
                    commentProfiles={post.commentProfiles}
                    dict={dict}
                    getDisplayName={getDisplayName}
                    getInitials={getInitials}
                    formatDate={formatDate}
                />
            </CardContent>
        </Card>
    );
}