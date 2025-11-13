"use client";

import { Heart, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { PostController } from "@/services/internal/community/controller/post.controller";
import { MarkdownContent } from "./markdown-content";

interface Post {
    id: string;
    content: string;
    imageUrl?: string | null;
    createdAt: string;
    authorName: string; // username from backend
    authorProfileUrl: string; // profile URL from backend
    reactions: {
        reactionCounts: {
            [key: string]: number;
        };
        userReaction: string | null;
    };
}

interface PostCardProps {
    post: Post;
    dict: Dictionary;
    isAdmin?: boolean;
    currentUserId?: string;
    onPostDeleted?: () => void;
    formatDate: (date: string | Date) => string;
}

export function PostCard({
    post,
    dict,
    isAdmin = false,
    currentUserId = "",
    onPostDeleted,
    formatDate,
}: PostCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // Use local state for reactions to avoid reloading the entire page
    const [hasUserLiked, setHasUserLiked] = useState(
        post.reactions?.userReaction === "LIKE",
    );
    const [likeCount, setLikeCount] = useState(
        post.reactions?.reactionCounts?.LIKE || 0,
    );

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await PostController.deletePost(post.id);
            setShowDeleteDialog(false);
            onPostDeleted?.();
        } catch (error) {
            console.error("Error deleting post:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleToggleLike = async () => {
        if (isLiking || !currentUserId) return;

        try {
            setIsLiking(true);

            // Optimistic update
            const wasLiked = hasUserLiked;
            const previousCount = likeCount;

            if (hasUserLiked) {
                // Optimistically update UI
                setHasUserLiked(false);
                setLikeCount((prev) => Math.max(0, prev - 1));

                // Unlike: DELETE /api/community/reactions with postId
                const response = await fetch("/api/community/reactions", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        postId: post.id,
                    }),
                });

                if (!response.ok && response.status !== 404) {
                    // Revert on error
                    setHasUserLiked(wasLiked);
                    setLikeCount(previousCount);
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to unlike");
                }
            } else {
                // Optimistically update UI
                setHasUserLiked(true);
                setLikeCount((prev) => prev + 1);

                // Like: POST /api/community/reactions
                const response = await fetch("/api/community/reactions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        postId: post.id,
                        reactionType: "LIKE",
                    }),
                });

                if (!response.ok && response.status !== 409) {
                    // Revert on error
                    setHasUserLiked(wasLiked);
                    setLikeCount(previousCount);
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to like");
                }
            }
        } catch (error) {
            console.error("Error toggling like:", error);
        } finally {
            setIsLiking(false);
        }
    };

    return (
        <>
            <AlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {dict?.communityFeed?.confirmDelete ||
                                "Delete Post"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {dict?.communityFeed?.confirmDeleteDescription ||
                                "Are you sure you want to delete this post? This action cannot be undone."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                            {dict?.communityFeed?.cancel || "Cancel"}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting
                                ? dict?.communityFeed?.deleting || "Deleting..."
                                : dict?.communityFeed?.delete || "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Card className="border-muted">
                <CardHeader className="gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="rounded-lg">
                                <AvatarImage
                                    src={post.authorProfileUrl}
                                    alt={post.authorName}
                                />
                                <AvatarFallback>
                                    {post.authorName.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <CardDescription className="text-xs">
                                    {post.authorName} ·{" "}
                                    {formatDate(post.createdAt)}
                                </CardDescription>
                            </div>
                        </div>
                        {isAdmin && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowDeleteDialog(true)}
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

                    {/* Reactions Section */}
                    <div className="flex items-center gap-2 pt-2">
                        <Button
                            variant={hasUserLiked ? "default" : "outline"}
                            size="sm"
                            onClick={handleToggleLike}
                            disabled={isLiking}
                            className="gap-1.5"
                        >
                            <Heart
                                className={`size-4 ${hasUserLiked ? "fill-current" : ""}`}
                            />
                            <span className="text-xs">{likeCount}</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
