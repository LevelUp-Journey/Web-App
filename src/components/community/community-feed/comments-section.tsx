"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import type { Dictionary } from "@/app/[lang]/dictionaries";

interface Comment {
    id: string;
    content: string;
    authorId: string;
    createdAt: string;
}

interface CommentsSectionProps {
    comments: Comment[];
    commentProfiles?: Record<string, any>;
    dict: Dictionary;
    getDisplayName: (profile: any) => string;
    getInitials: (profile: any, fallback: string) => string;
    formatDate: (date: string | Date) => string;
}

export function CommentsSection({
    comments,
    commentProfiles,
    dict,
    getDisplayName,
    getInitials,
    formatDate,
}: CommentsSectionProps) {
    return (
        <div className="space-y-3">
            <p className="text-sm font-semibold">
                {dict?.communityFeed?.commentsTitle || "Comments"}
            </p>
            {comments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                    {dict?.communityFeed?.emptyComments || "No comments yet"}
                </p>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => {
                        const commenterProfile =
                            commentProfiles?.[comment.authorId];
                        return (
                            <div
                                key={comment.id}
                                className="rounded-md border p-3"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src={
                                                commenterProfile?.profileUrl ??
                                                undefined
                                            }
                                            alt={getDisplayName(
                                                commenterProfile,
                                            )}
                                        />
                                        <AvatarFallback>
                                            {getInitials(
                                                commenterProfile,
                                                comment.content,
                                            )}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">
                                            {getDisplayName(commenterProfile)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDate(comment.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                    {comment.content}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}