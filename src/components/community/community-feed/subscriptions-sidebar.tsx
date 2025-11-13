"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
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

const SubscriptionItem = memo<{
    subscription: any;
    isCurrentCommunity: boolean;
}>(({ subscription, isCurrentCommunity }) => (
    <Tooltip key={subscription.id}>
        <TooltipTrigger asChild>
            <Link
                href={`/dashboard/community/${subscription.communityId}`}
                className={`relative flex-shrink-0 group ${
                    isCurrentCommunity ? "pointer-events-none" : ""
                }`}
            >
                <div
                    className={`relative w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden border-2 transition-colors duration-200 ${
                        isCurrentCommunity
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-border group-hover:border-primary"
                    }`}
                >
                    {subscription.communityImageUrl ? (
                        <Image
                            src={subscription.communityImageUrl}
                            alt={subscription.communityName}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 48px, 56px"
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
                <p className="font-medium">{subscription.communityName}</p>
            </TooltipContent>
        )}
    </Tooltip>
));

SubscriptionItem.displayName = "SubscriptionItem";

export const SubscriptionsSidebar = memo<SubscriptionsSidebarProps>(
    ({ currentCommunityId }) => {
        const { subscriptions, loading, error } = useUserSubscriptions();

        // Memoize current community check
        const memoizedSubscriptions = useMemo(() =>
            subscriptions.map((subscription) => ({
                ...subscription,
                isCurrentCommunity: subscription.communityId === currentCommunityId,
            })), [subscriptions, currentCommunityId]
        );

        return (
            <aside className="fixed right-4 md:right-6 top-[5rem] bottom-[12rem] w-20 md:w-24 hidden md:block z-10">
                <Card className="h-full flex flex-col p-3 md:p-4">
                    <TooltipProvider delayDuration={300}>
                        <div className="flex flex-col gap-2 md:gap-3 overflow-y-auto items-center scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                            {loading ? (
                                // Loading state - show spinner
                                <div className="flex items-center justify-center py-4">
                                    <Spinner className="size-6" />
                                </div>
                            ) : error ? (
                                // Error state - show error indicator
                                <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-lg border-2 border-destructive/20 bg-destructive/5">
                                    <span className="text-xs text-destructive">!</span>
                                </div>
                            ) : subscriptions.length === 0 ? (
                                // Empty state - show placeholder
                                <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-lg border-2 border-muted bg-muted/50">
                                    <span className="text-xs text-muted-foreground">0</span>
                                </div>
                            ) : (
                                // Success state - show subscriptions
                                memoizedSubscriptions.map((subscription) => (
                                    <SubscriptionItem
                                        key={subscription.id}
                                        subscription={subscription}
                                        isCurrentCommunity={subscription.isCurrentCommunity}
                                    />
                                ))
                            )}
                        </div>
                    </TooltipProvider>
                </Card>
            </aside>
        );
    }
);

SubscriptionsSidebar.displayName = "SubscriptionsSidebar";
