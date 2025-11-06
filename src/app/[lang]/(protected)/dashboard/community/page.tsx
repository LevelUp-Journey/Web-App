"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon, MessageSquareIcon, Plus, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { FeedPostCard } from "@/components/community/feed-post-card";
import { EmptyFeed } from "@/components/community/empty-feed";
import { useCommunityFeed } from "@/hooks/use-community-feed";
import { useFollowingFeed } from "@/hooks/use-following-feed";
import { useCreatePostData } from "@/hooks/use-create-post-data";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function CommunityFeedPage() {
    const router = useRouter();
    const {
        posts: allPosts,
        loading: allLoading,
        error: allError,
    } = useCommunityFeed();
    const {
        posts: followingPosts,
        loading: followingLoading,
        error: followingError,
    } = useFollowingFeed();
    const { communities, canCreatePost } = useCreatePostData();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<"feed" | "following">("feed");
    const [showCommunityDialog, setShowCommunityDialog] = useState(false);

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
                    <div className="flex flex-col items-center justify-center min-h-[400px]">
                        <Spinner className="size-8 mb-4" />
                        <p className="text-muted-foreground">Loading community feed...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full overflow-y-auto">
                <div className="container mx-auto p-6">
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <AlertCircle />
                            </EmptyMedia>
                            <EmptyTitle>Error fetching community feed</EmptyTitle>
                            <EmptyDescription>
                                {error}
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Button onClick={() => window.location.reload()} variant="outline">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Retry
                            </Button>
                        </EmptyContent>
                    </Empty>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 w-full h-full overflow-y-auto bg-muted/20">
            {/* Feed Content */}
            <div className="container mx-auto px-4 py-4">
                <div className="max-w-2xl mx-auto space-y-4">
                    {/* Header with Tabs */}
                    <div className="flex justify-center gap-4">
                        {/* Tabs */}
                        <Tabs
                            value={activeTab}
                            onValueChange={(value) =>
                                setActiveTab(value as "feed" | "following")
                            }
                        >
                            <TabsList>
                                <TabsTrigger value="feed">Feed</TabsTrigger>
                                <TabsTrigger value="following">
                                    Following
                                </TabsTrigger>
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
                                        No posts match your search. Try
                                        different keywords.
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
                    <div className="space-y-4 mt-6">
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

            {/* Floating Action Button - Only for Teachers */}
            {canCreatePost && (
                <div className="fixed bottom-6 right-6 z-50">
                    <Button
                        size="lg"
                        onClick={() => setShowCommunityDialog(true)}
                        className="rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <Plus className="h-6 w-6" />
                    </Button>
                </div>
            )}

            {/* Community Selection Dialog for Teachers */}
            <Dialog
                open={showCommunityDialog}
                onOpenChange={setShowCommunityDialog}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create Post</DialogTitle>
                        <DialogDescription>
                            Choose a community to share your post
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {communities.length === 0 ? (
                            <div className="text-center space-y-4 py-8">
                                <p className="text-muted-foreground">
                                    You don't have any communities yet.
                                </p>
                                <Button
                                    onClick={() => {
                                        setShowCommunityDialog(false);
                                        router.push("/dashboard/communities");
                                    }}
                                    className="w-full"
                                >
                                    Create Your First Community
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {communities.map((community) => (
                                    <div
                                        key={community.id}
                                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                                        onClick={() => {
                                            setShowCommunityDialog(false);
                                            router.push(
                                                `/dashboard/community/${community.id}/posts/create`,
                                            );
                                        }}
                                    >
                                        <div className="flex-1">
                                            <h3 className="font-medium">
                                                {community.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground line-clamp-1">
                                                {community.description}
                                            </p>
                                        </div>
                                        <Button size="sm" variant="outline">
                                            Post Here
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
