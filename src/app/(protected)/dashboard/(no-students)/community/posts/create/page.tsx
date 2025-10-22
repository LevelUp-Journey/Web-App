"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostForm } from "@/components/community/post-form";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import { ProfileController } from "@/services/internal/profiles/controller/profile.controller";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import type { Community } from "@/services/internal/community/entities/community.entity";

export default function CreatePostPage() {
    const router = useRouter();
    const [communities, setCommunities] = useState<Community[]>([]);
    const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
    const [authorId, setAuthorId] = useState<string>("");
    const [usernames, setUsernames] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                // Get current user ID
                const userId = await AuthController.getUserId();
                setAuthorId(userId);

                // Get all communities
                const allCommunities = await CommunityController.getCommunities();
                setCommunities(allCommunities);

                // Load usernames for community owners
                const usernameMap: Record<string, string> = {};
                await Promise.all(
                    allCommunities.map(async (community) => {
                        try {
                            const profile = await ProfileController.getProfileByUserId(community.ownerId);
                            usernameMap[community.ownerId] = profile.username;
                        } catch (error) {
                            console.error(`Error loading profile for ${community.ownerId}:`, error);
                            usernameMap[community.ownerId] = "Unknown User";
                        }
                    })
                );
                setUsernames(usernameMap);

            } catch (err) {
                console.error("Error loading data:", err);
                setError("Failed to load communities");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handlePostCreated = () => {
        // Redirect to the community page where the post was created
        if (selectedCommunity) {
            router.push(`/dashboard/community/${selectedCommunity.id}`);
        } else {
            router.push("/dashboard/community");
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <div className="max-w-2xl mx-auto space-y-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>

                    <div className="text-center space-y-4">
                        <h1 className="text-xl font-semibold">Error</h1>
                        <p className="text-muted-foreground">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>

                {!selectedCommunity ? (
                    /* Community Selection */
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-bold">Create Post</h1>
                            <p className="text-muted-foreground">
                                Select a community to share your post
                            </p>
                        </div>

                        {communities.length === 0 ? (
                            <Card>
                                <CardContent className="p-8 text-center">
                                    <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">No communities available</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Create a community first to start posting.
                                    </p>
                                    <Button onClick={() => router.push("/dashboard/community/create")}>
                                        Create Community
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {communities.map((community) => (
                                    <Card
                                        key={community.id}
                                        className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                                        onClick={() => setSelectedCommunity(community)}
                                    >
                                        {/* Banner */}
                                        <div className="w-full h-32 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                                            {community.imageUrl ? (
                                                <img
                                                    src={community.imageUrl}
                                                    alt={`${community.name} banner`}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="text-4xl font-bold text-primary/20">
                                                        {community.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <CardContent className="p-4 space-y-3">
                                            {/* Nombre de la comunidad */}
                                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                                                {community.name}
                                            </h3>

                                            {/* Descripción */}
                                            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                                                {community.description}
                                            </p>

                                            {/* Footer con creador */}
                                            <div className="pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                                                <span className="font-medium">
                                                    By <span className="text-foreground">{usernames[community.ownerId] || "Usuario"}</span>
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    /* Post Form */
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold">
                                    Create Post in {selectedCommunity.name}
                                </h1>
                                <p className="text-muted-foreground">
                                    Share your thoughts with the community
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setSelectedCommunity(null)}
                            >
                                Change Community
                            </Button>
                        </div>

                        <PostForm
                            communityId={selectedCommunity.id}
                            authorId={authorId}
                            onSuccess={handlePostCreated}
                            onCancel={() => setSelectedCommunity(null)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
