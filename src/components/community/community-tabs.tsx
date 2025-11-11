"use client";

import { useCallback, useMemo, useState } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { DiscoverTab } from "@/components/community/discover-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type CommunityTabValue = "feed" | "discover" | "profile";

interface CommunityTabsProps {
    dict: Dictionary;
}

export function CommunityTabs({ dict }: CommunityTabsProps) {
    const [activeTab, setActiveTab] = useState<CommunityTabValue>("feed");
    const [mountedTabs, setMountedTabs] = useState<CommunityTabValue[]>([
        "feed",
    ]);

    const handleTabChange = useCallback((value: string) => {
        const tabValue = value as CommunityTabValue;
        setActiveTab(tabValue);
        setMountedTabs((prev) =>
            prev.includes(tabValue) ? prev : [...prev, tabValue],
        );
    }, []);

    const tabLabels = useMemo(
        () => ({
            feed: "Feed",
            discover: "Discover",
            profile: "Profile",
        }),
        [],
    );

    const shouldRender = useCallback(
        (tab: CommunityTabValue) => mountedTabs.includes(tab),
        [mountedTabs],
    );

    return (
        <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
        >
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="feed">{tabLabels.feed}</TabsTrigger>
                <TabsTrigger value="discover">{tabLabels.discover}</TabsTrigger>
                <TabsTrigger value="profile">{tabLabels.profile}</TabsTrigger>
            </TabsList>

            <TabsContent value="feed" className="mt-6">
                {shouldRender("feed") && (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <h2 className="text-2xl font-bold text-muted-foreground">
                            Feed Content
                        </h2>
                    </div>
                )}
            </TabsContent>

            <TabsContent value="discover" className="mt-6">
                {shouldRender("discover") && <DiscoverTab />}
            </TabsContent>

            <TabsContent value="profile" className="mt-6">
                {shouldRender("profile") && (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <h2 className="text-2xl font-bold text-muted-foreground">
                            Profile Content
                        </h2>
                    </div>
                )}
            </TabsContent>
        </Tabs>
    );
}
