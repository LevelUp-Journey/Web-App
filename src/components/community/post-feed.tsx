"use client";

import { SearchIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { PostCard } from "./post-card";
import { Button } from "@/components/ui/button";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import type { Post } from "@/services/internal/community/entities/post.entity";

interface PostFeedProps {
    posts: Post[];
    title?: string;
    showSearch?: boolean;
    canCreatePost?: boolean;
}

export function PostFeed({
    posts,
    title = "Community Posts",
    showSearch = true,
    canCreatePost = false,
}: PostFeedProps) {
    return (
        <div className="space-y-4">
            {showSearch && (
                <div className="flex justify-center pt-4">
                    <div className="relative max-w-md w-full">
                        <InputGroup>
                            <InputGroupInput placeholder="Search..." />
                            <InputGroupAddon>
                                <SearchIcon />
                            </InputGroupAddon>
                            <InputGroupAddon align="inline-end">
                                <InputGroupButton>Search</InputGroupButton>
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                </div>
            )}

            <div className="container mx-auto p-4 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">{title}</h2>
                    {canCreatePost && (
                        <Link href="/dashboard/community/posts/create">
                            <Button>
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Create
                            </Button>
                        </Link>
                    )}
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PostFeed;
