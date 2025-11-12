"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CommentsSection } from "./comments-section";
import type { Dictionary } from "@/app/[lang]/dictionaries";

interface Post {
    id: string;
    title: string;
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
    getDisplayName: (profile: any) => string;
    getInitials: (profile: any, fallback: string) => string;
    formatDate: (date: string | Date) => string;
}

export function PostCard({
    post,
    dict,
    getDisplayName,
    getInitials,
    formatDate,
}: PostCardProps) {
    return (
        <Card className="border-muted">
            <CardHeader className="gap-4">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage
                            src={post.authorProfile?.profileUrl ?? undefined}
                            alt={getDisplayName(post.authorProfile)}
                        />
                        <AvatarFallback>
                            {getInitials(post.authorProfile, post.title)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-base">{post.title}</CardTitle>
                        <CardDescription className="text-xs">
                            {getDisplayName(post.authorProfile)} ·{" "}
                            {formatDate(post.createdAt)}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed">{post.content}</p>

                {post.imageUrl && (
                    <div className="relative rounded-lg overflow-hidden border min-h-[200px] w-full">
                        <Image
                            src={post.imageUrl}
                            alt={post.title}
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