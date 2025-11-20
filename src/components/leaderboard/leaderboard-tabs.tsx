"use client";

import { useCallback, useMemo, useState } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { LeaderboardPage as LeaderboardContent } from "@/components/leaderboard/leaderboard-page/Leaderboard";
import { RanksTabContent } from "@/components/leaderboard/rank-page/ranks-tab-content";
import { MyRankContent } from "@/components/leaderboard/user-page/my-rank-content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type LeaderboardTabValue = "leaderboard" | "myrank" | "ranks";

interface LeaderboardTabsProps {
    dict: Dictionary;
}

export function LeaderboardTabs({ dict }: LeaderboardTabsProps) {
    const [activeTab, setActiveTab] =
        useState<LeaderboardTabValue>("leaderboard");
    const [mountedTabs, setMountedTabs] = useState<LeaderboardTabValue[]>([
        "leaderboard",
    ]);

    const handleTabChange = useCallback((value: string) => {
        const tabValue = value as LeaderboardTabValue;
        setActiveTab(tabValue);
        setMountedTabs((prev) =>
            prev.includes(tabValue) ? prev : [...prev, tabValue],
        );
    }, []);

    const tabLabels = useMemo(
        () => ({
            leaderboard: dict.leaderboard.ranking,
            myrank: dict.leaderboard.myRank,
            ranks: dict.leaderboard.information,
        }),
        [
            dict.leaderboard.information,
            dict.leaderboard.myRank,
            dict.leaderboard.ranking,
        ],
    );

    const shouldRender = useCallback(
        (tab: LeaderboardTabValue) => mountedTabs.includes(tab),
        [mountedTabs],
    );

    return (
        <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
        >
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="leaderboard">
                    {tabLabels.leaderboard}
                </TabsTrigger>
                <TabsTrigger value="myrank">{tabLabels.myrank}</TabsTrigger>
                <TabsTrigger value="ranks">{tabLabels.ranks}</TabsTrigger>
            </TabsList>

            <TabsContent value="leaderboard" className="mt-6">
                {shouldRender("leaderboard") && (
                    <>
                        <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
                        <LeaderboardContent dict={dict} />
                    </>
                )}
            </TabsContent>

            <TabsContent value="myrank" className="mt-6">
                {shouldRender("myrank") && <MyRankContent dict={dict} />}
            </TabsContent>

            <TabsContent value="ranks" className="mt-6">
                {shouldRender("ranks") && <RanksTabContent dict={dict} />}
            </TabsContent>
        </Tabs>
    );
}
