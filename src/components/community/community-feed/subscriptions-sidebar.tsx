"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUserSubscriptions } from "@/hooks/use-user-subscriptions";

interface SubscriptionsSidebarProps {
    currentCommunityId?: string;
}

export function SubscriptionsSidebar({
    currentCommunityId,
}: SubscriptionsSidebarProps) {
    const { subscriptions, loading, error } = useUserSubscriptions();

    if (loading) {
        return (
            <aside className="fixed right-4 md:right-6 top-[5rem] w-20 md:w-24 hidden md:block z-10">
                <Card className="p-3 md:p-4 flex flex-col items-center gap-3">
                    <Skeleton className="w-12 h-12 md:w-14 md:h-14 rounded-lg" />
                    <Skeleton className="w-12 h-12 md:w-14 md:h-14 rounded-lg" />
                    <Skeleton className="w-12 h-12 md:w-14 md:h-14 rounded-lg" />
                </Card>
            </aside>
        );
    }

    if (error || subscriptions.length === 0) {
        return null;
    }

    return (
        <aside className="fixed right-4 md:right-6 top-[5rem] bottom-[12rem] w-20 md:w-24 hidden md:block z-10">
            <Card className="h-full flex flex-col p-3 md:p-4">
                <TooltipProvider delayDuration={300}>
                    <div className="flex flex-col gap-2 md:gap-3 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent items-center">
                        {subscriptions.map((subscription) => {
                            const isCurrentCommunity =
                                subscription.communityId === currentCommunityId;

                            return (
                                <Tooltip key={subscription.id}>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={`/dashboard/community/${subscription.communityId}`}
                                            className={`relative flex-shrink-0 ${isCurrentCommunity ? "pointer-events-none" : ""}`}
                                        >
                                            <div
                                                className={`relative w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden border-2 transition-all ${
                                                    isCurrentCommunity
                                                        ? "border-primary ring-2 ring-primary/20"
                                                        : "border-border hover:border-primary hover:scale-110"
                                                }`}
                                            >
                                                {subscription.communityImageUrl ? (
                                                    <Image
                                                        src={
                                                            subscription.communityImageUrl
                                                        }
                                                        alt={
                                                            subscription.communityName
                                                        }
                                                        fill
                                                        className="object-cover"
                                                        sizes="(max-width: 768px) 48px, 56px"
                                                        priority={false}
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-muted flex items-center justify-center">
                                                        <span className="text-base md:text-lg font-semibold text-muted-foreground">
                                                            {subscription.communityName
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    </TooltipTrigger>
                                    {!isCurrentCommunity && (
                                        <TooltipContent side="left">
                                            <p className="font-medium">
                                                {subscription.communityName}
                                            </p>
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            );
                        })}
                    </div>
                </TooltipProvider>
            </Card>
        </aside>
    );
}
