"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import CommunityCard from "@/components/community/community-card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useDictionary } from "@/hooks/use-dictionary";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import type { Community } from "@/services/internal/community/entities/community.entity";

export default function AdminCommunityPage() {
    const [communities, setCommunities] = useState<Community[]>([]);
    const [loading, setLoading] = useState(true);
    const PATHS = useLocalizedPaths();
    const dict = useDictionary();

    useEffect(() => {
        const loadMyCommunities = async () => {
            try {
                setLoading(true);
                const data = await CommunityController.getMyCommunities();
                setCommunities(data);
            } catch (error) {
                console.error("Error loading my communities:", error);
            } finally {
                setLoading(false);
            }
        };

        loadMyCommunities();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
                <div className="text-center">
                    <Spinner className="size-8 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                        {dict?.common?.loading || "Loading communities..."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">
                        {dict?.admin?.community?.title || "My Communities"}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {dict?.admin?.community?.subtitle ||
                            "Manage your communities"}
                    </p>
                </div>
                <Button asChild>
                    <Link
                        href={PATHS.DASHBOARD.ADMINISTRATION.COMMUNITY.CREATE}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        {dict?.admin?.community?.createButton ||
                            "Create Community"}
                    </Link>
                </Button>
            </div>

            {communities.length === 0 ? (
                <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 mb-4 rounded-full bg-muted flex items-center justify-center">
                        <Plus className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">
                        {dict?.admin?.community?.noCommunities?.title ||
                            "No communities yet"}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        {dict?.admin?.community?.noCommunities?.description ||
                            "Create your first community to get started"}
                    </p>
                    <Button asChild>
                        <Link
                            href={
                                PATHS.DASHBOARD.ADMINISTRATION.COMMUNITY.CREATE
                            }
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            {dict?.admin?.community?.createButton ||
                                "Create Community"}
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {communities.map((community) => (
                        <div key={community.id} className="relative">
                            <CommunityCard community={community} />
                            <div className="mt-3 flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    asChild
                                >
                                    <Link
                                        href={PATHS.DASHBOARD.ADMINISTRATION.COMMUNITY.EDIT(
                                            community.id,
                                        )}
                                    >
                                        {dict?.common?.edit || "Edit"}
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
