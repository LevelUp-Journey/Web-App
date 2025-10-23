"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon, MessageSquareIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import { FeedPostCard } from "@/components/community/feed-post-card";
import { EmptyFeed } from "@/components/community/empty-feed";
import { useCommunityFeed } from "@/hooks/use-community-feed";

export default function CommunityFeedPage() {
    const router = useRouter();
    const { posts, loading, error } = useCommunityFeed();
    const [searchTerm, setSearchTerm] = useState("");

    // Filtrar posts basado en el término de búsqueda
    const filteredPosts = useMemo(() => {
        if (!searchTerm.trim()) return posts;
        
        return posts.filter((post) =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.community?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.authorProfile?.username.toLowerCase().includes(searchTerm.toLowerCase())
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
            {/* Search Bar - Centered */}
            <div className="flex justify-center pt-4">
                <div className="relative max-w-md w-full">
                    <InputGroup>
                        <InputGroupInput 
                            placeholder="Search posts..." 
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <InputGroupAddon>
                            <SearchIcon />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">
                            <InputGroupButton>Search</InputGroupButton>
                        </InputGroupAddon>
                    </InputGroup>
                </div>
            </div>

            {/* Feed Content */}
            <div className="container mx-auto px-6 py-4 space-y-4">
                {/* Header */}
                <div className="flex items-center">
                    <div>
                        <h2 className="text-2xl font-semibold">Feed</h2>
                        <p className="text-muted-foreground">
                            Discover posts from all communities
                        </p>
                    </div>
                </div>

                {/* Search Results */}
                {searchTerm.trim() && (
                    <div className="space-y-6">
                        {/* Posts Section */}
                        {filteredPosts.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <MessageSquareIcon className="h-5 w-5" />
                                    <h3 className="text-lg font-semibold">Posts</h3>
                                </div>
                                <div className="space-y-6">
                                    {filteredPosts.map((post) => (
                                        <FeedPostCard key={post.id} post={post} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* No Results */}
                        {filteredPosts.length === 0 && (
                            <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed rounded-lg p-8">
                                <SearchIcon className="h-16 w-16 text-muted-foreground mb-4" />
                                <h2 className="text-xl font-semibold mb-2">No results found</h2>
                                <p className="text-muted-foreground text-center mb-4 max-w-md">
                                    No posts match your search. Try different keywords.
                                </p>
                                <Button variant="outline" size="sm" onClick={() => handleSearch("")}>
                                    Clear Search
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Default Feed (when no search) */}
                {!searchTerm.trim() && (
                    <div className="space-y-6 w-full">
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
    );
}
