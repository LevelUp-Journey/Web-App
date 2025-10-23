"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommunityCard } from "@/components/community/community-card";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import type { Community } from "@/services/internal/community/entities/community.entity";
import { PATHS } from "@/lib/paths";
import { ProfileController } from "@/services/internal/profiles/controller/profile.controller";

export default function AdminCommunityPage() {
    const router = useRouter();
    const [communities, setCommunities] = useState<Community[]>([]);
    const [usernames, setUsernames] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                const data = await CommunityController.getCommunities();

                // Cargar usernames para cada comunidad
                const usernameMap: Record<string, string> = {};
                await Promise.all(
                    data.map(async (community) => {
                        try {
                            const profile =
                                await ProfileController.getProfileById(
                                    community.ownerProfileId,
                                );
                            usernameMap[community.ownerId] = profile.username;
                        } catch (error) {
                            console.error(
                                `Error loading profile for ${community.ownerProfileId}:`,
                                error,
                            );
                            usernameMap[community.ownerId] = "Unknown User";
                        }
                    }),
                );

                setCommunities(data);
                setUsernames(usernameMap);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load communities",
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCommunities();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto p-4 space-y-4">
                <div className="flex items-center justify-center min-h-[400px]">
                    <p className="text-muted-foreground">
                        Loading communities...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4 space-y-4">
                <div className="text-center space-y-4">
                    <h1 className="text-xl font-semibold">Error</h1>
                    <p className="text-muted-foreground">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Community Management</h1>
                <Button
                    onClick={() =>
                        router.push(
                            PATHS.DASHBOARD.ADMINISTRATION.COMMUNITY.CREATE,
                        )
                    }
                    size="sm"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Community
                </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {communities.map((community) => (
                    <CommunityCard
                        key={community.id}
                        community={community}
                        username={usernames[community.ownerId]}
                        adminMode={true}
                    />
                ))}
            </div>
            {communities.length === 0 && (
                <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed rounded-lg p-8">
                    <h2 className="text-xl font-semibold mb-2">
                        No communities found
                    </h2>
                    <p className="text-muted-foreground text-center mb-4">
                        Create your first community to get started.
                    </p>
                    <Button
                        onClick={() =>
                            router.push(
                                PATHS.DASHBOARD.ADMINISTRATION.COMMUNITY.CREATE,
                            )
                        }
                        size="sm"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Community
                    </Button>
                </div>
            )}
        </div>
    );
}
