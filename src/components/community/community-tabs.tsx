"use client";

import { useCallback, useMemo, useState } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { DiscoverTab } from "@/components/community/discover-tab";
import { FeedTab } from "@/components/community/feed-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type CommunityTabValue = "discover" | "feed";

interface CommunityTabsProps {
    dict: Dictionary;
}

export function CommunityTabs({ dict }: CommunityTabsProps) {
    const [activeTab, setActiveTab] = useState<CommunityTabValue>("discover");
    const [mountedTabs, setMountedTabs] = useState<CommunityTabValue[]>([
        "discover",
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
            discover: "Discover",
            feed: "Feed",
        }),
        [],
    );

    const shouldRender = useCallback(
        (tab: CommunityTabValue) => mountedTabs.includes(tab),
        [mountedTabs],
    );

    return (
        <div className="relative">
            <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full"
            >
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="discover">{tabLabels.discover}</TabsTrigger>
                    <TabsTrigger value="feed">{tabLabels.feed}</TabsTrigger>
                </TabsList>

                <TabsContent value="discover" className="mt-6">
                    {shouldRender("discover") && <DiscoverTab />}
                </TabsContent>

                <TabsContent value="feed" className="mt-6">
                    {shouldRender("feed") && <FeedTab dict={dict} />}
                </TabsContent>
            </Tabs>

            {/* Subscriptions Sidebar - visible across all tabs */}
            {/* <SubscriptionsSidebar /> */}
        </div>
    );
}
