"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon, MessageSquareIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeedPostCard } from "@/components/community/feed-post-card";
import { EmptyFeed } from "@/components/community/empty-feed";
import { useCommunityFeed } from "@/hooks/use-community-feed";
import { useFollowingFeed } from "@/hooks/use-following-feed";

export default function CommunityFeedPage() {
    const router = useRouter();
    const { posts: allPosts, loading: allLoading, error: allError } = useCommunityFeed();
    const { posts: followingPosts, loading: followingLoading, error: followingError } = useFollowingFeed();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<"feed" | "following">("feed");

    // Determine which posts to use based on active tab
    const posts = activeTab === "feed" ? allPosts : followingPosts;
    const loading = activeTab === "feed" ? allLoading : followingLoading;
    const error = activeTab === "feed" ? allError : followingError;

    // Filtrar posts basado en el término de búsqueda
    const filteredPosts = useMemo(() => {
        if (!searchTerm.trim()) return posts;

        return posts.filter(
            (post) =>
                post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.community?.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                post.authorProfile?.username
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()),
        );
    }, [posts, searchTerm]);

    // Manejar búsqueda
    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    if (loading) {
        return (
            <div className="w-full h-full overflow-y-auto">
                <div className="container mx-auto p-6">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <p className="text-muted-foreground">Loading</p>
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
        <div className="space-y-4 w-full h-full overflow-y-auto">
            {/* Back Button - Outside Feed Layout */}
            <div className="container mx-auto px-4 pt-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
            </div>

            {/* Feed Content */}
            <div className="container mx-auto px-4 py-4">
                
                <div className="max-w-2xl mx-auto space-y-4">
                    {/* Header with Tabs */}
                    <div className="flex justify-center gap-4">
                        {/* Tabs */}
                        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "feed" | "following")}>
                            <TabsList>
                                <TabsTrigger value="feed">Feed</TabsTrigger>
                                <TabsTrigger value="following">Following</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                {/* Search Results */}
                {searchTerm.trim() && (
                    <div className="space-y-6">
                        {/* Posts Section */}
                        {filteredPosts.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <MessageSquareIcon className="h-5 w-5" />
                                    <h3 className="text-lg font-semibold">
                                        Posts
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    {filteredPosts.map((post) => (
                                        <FeedPostCard
                                            key={post.id}
                                            post={post}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* No Results */}
                        {filteredPosts.length === 0 && (
                            <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed rounded-lg p-8">
                                <SearchIcon className="h-16 w-16 text-muted-foreground mb-4" />
                                <h2 className="text-xl font-semibold mb-2">
                                    No results found
                                </h2>
                                <p className="text-muted-foreground text-center mb-4 max-w-md">
                                    No posts match your search. Try different
                                    keywords.
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSearch("")}
                                >
                                    Clear Search
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Default Feed (when no search) */}
                {!searchTerm.trim() && (
                    <div className="space-y-4">
                        {posts.length === 0 ? (
                            <EmptyFeed />
                        ) : (
                            posts.map((post) => (
                                <FeedPostCard key={post.id} post={post} />
                            ))
                        )}
                    </div>
                )}
                </div>
            </div>
        </div>
    );
}
