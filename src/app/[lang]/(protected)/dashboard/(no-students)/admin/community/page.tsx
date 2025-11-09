"use client";

import { AlertCircle, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CommunityCard } from "@/components/community/community-card";
import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { PATHS } from "@/lib/paths";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import type { Community } from "@/services/internal/community/entities/community.entity";
import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";
import { Spinner } from "@/components/ui/spinner";

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
                        const profile = await ProfileController.getProfileById(
                            community.ownerProfileId,
                        );
                        usernameMap[community.ownerId] =
                            profile?.username || "Unknown User";
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
                <Empty className="min-h-[400px]">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <Spinner className="size-6 text-muted-foreground" />
                        </EmptyMedia>
                        <EmptyTitle>Loading communities</EmptyTitle>
                        <EmptyDescription>
                            Preparing your community management tools.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4 space-y-4">
                <Empty className="min-h-[400px]">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <AlertCircle />
                        </EmptyMedia>
                        <EmptyTitle>Unable to load communities</EmptyTitle>
                        <EmptyDescription>{error}</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Button onClick={() => window.location.reload()}>
                            Retry
                        </Button>
                    </EmptyContent>
                </Empty>
            </div>
        );
    }

    if (communities.length === 0) {
        return (
            <div className="container mx-auto p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">
                        Community Management
                    </h1>
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
                <Empty className="min-h-[300px]">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <AlertCircle />
                        </EmptyMedia>
                        <EmptyTitle>No communities yet</EmptyTitle>
                        <EmptyDescription>
                            Create your first community to get started.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Button
                            onClick={() =>
                                router.push(
                                    PATHS.DASHBOARD.ADMINISTRATION.COMMUNITY
                                        .CREATE,
                                )
                            }
                            size="sm"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Community
                        </Button>
                    </EmptyContent>
                </Empty>
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
        </div>
    );
}
