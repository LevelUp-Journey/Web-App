"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import CommunityCard from "@/components/cards/community-card";
import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { useDictionary } from "@/hooks/use-dictionary";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import type { Community } from "@/services/internal/community/entities/community.entity";

export default function CommunityPage() {
    const dict = useDictionary();
    const [userRole, setUserRole] = useState<string | null>(null);
    const [permissionsChecked, setPermissionsChecked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [communities, setCommunities] = useState<Community[]>([]);
    const [error, setError] = useState<string | null>(null);
    const PATHS = useLocalizedPaths();

    useEffect(() => {
        const checkPermissions = async () => {
            try {
                const roles = await AuthController.getUserRoles();
                const role = roles.find(
                    (r) => r === "ROLE_TEACHER" || r === "ROLE_ADMIN",
                );
                setUserRole(role || null);
            } catch (err) {
                console.error("Error checking permissions:", err);
                setError(
                    dict?.admin.community.permissionsError ||
                        "We couldn't verify your permissions.",
                );
            } finally {
                setPermissionsChecked(true);
            }
        };

        checkPermissions();
    }, []);

    useEffect(() => {
        if (!permissionsChecked) return;
        if (!userRole) {
            setLoading(false);
            return;
        }

        const loadCommunities = async () => {
            setLoading(true);
            setError(null);
            try {
                // Get the user ID to fetch their communities
                const userId = await AuthController.getUserId();
                const response =
                    await CommunityController.getCommunitiesByCreator(userId);

                if (response) {
                    setCommunities(response);
                } else {
                    setError(
                        dict?.admin.community.error ||
                            "We couldn't load the communities.",
                    );
                }
            } catch (err) {
                console.error("Error loading communities:", err);
                setError(
                    dict?.admin.community.error ||
                        "We couldn't load the communities. Please try again.",
                );
            } finally {
                setLoading(false);
            }
        };

        loadCommunities();
    }, [permissionsChecked, userRole]);

    if (!permissionsChecked || loading) {
        return (
            <Empty className="min-h-[400px]">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Spinner className="size-6 text-muted-foreground" />
                    </EmptyMedia>
                    <EmptyTitle>{dict?.admin.community.loading}</EmptyTitle>
                    <EmptyDescription>
                        {dict?.admin.community.loadingDescription}
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }

    if (!userRole) {
        return (
            <Empty className="min-h-[400px]">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <AlertCircle />
                    </EmptyMedia>
                    <EmptyTitle>
                        {error
                            ? dict?.admin.community.permissionsError
                            : "Access Denied"}
                    </EmptyTitle>
                    <EmptyDescription>
                        {error ||
                            "You don't have permission to access this page."}
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }

    // Main content
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">
                        {dict?.admin.community.title}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        {dict?.admin.community.subtitle}
                    </p>
                </div>
                <Button asChild>
                    <Link href={PATHS.DASHBOARD.ADMINISTRATION.COMMUNITY.CREATE}>
                        {dict?.admin.community.create}
                    </Link>
                </Button>
            </div>

            {/* Content */}
            {error ? (
                <Empty className="min-h-[300px]">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <AlertCircle />
                        </EmptyMedia>
                        <EmptyTitle>{dict?.admin.community.error}</EmptyTitle>
                        <EmptyDescription>{error}</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Button onClick={() => window.location.reload()}>
                            {dict?.admin.community.retry}
                        </Button>
                    </EmptyContent>
                </Empty>
            ) : communities.length === 0 ? (
                <Empty className="min-h-[300px]">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <AlertCircle />
                        </EmptyMedia>
                        <EmptyTitle>
                            {dict?.admin.community.noCommunities}
                        </EmptyTitle>
                        <EmptyDescription>
                            {dict?.admin.community.noCommunitiesDescription}
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Button asChild>
                            <Link
                                href={
                                    PATHS.DASHBOARD.ADMINISTRATION.COMMUNITY
                                        .CREATE
                                }
                            >
                                {dict?.admin.community.create}
                            </Link>
                        </Button>
                    </EmptyContent>
                </Empty>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {communities.map((community) => (
                        <CommunityCard
                            key={community.id}
                            community={community}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
