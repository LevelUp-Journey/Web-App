"use client";

import Link from "next/link";
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
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import type { Dictionary } from "@/app/[lang]/dictionaries";

interface CommunityStateProps {
    state: "loading" | "error";
    dict: Dictionary;
    onRetry?: () => void;
}

export function CommunityState({
    state,
    dict,
    onRetry,
}: CommunityStateProps) {
    const PATHS = useLocalizedPaths();

    return (
        <Empty className="min-h-[400px]">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Spinner className="size-6 text-muted-foreground" />
                </EmptyMedia>
                <EmptyTitle>
                    {state === "loading"
                        ? dict?.communityFeed?.loadingTitle ||
                          "Loading community"
                        : dict?.communityFeed?.failedToLoad ||
                          "We couldn't load this community"}
                </EmptyTitle>
                <EmptyDescription>
                    {state === "loading"
                        ? dict?.communityFeed?.loadingDescription ||
                          "Hang tight while we fetch the latest activity."
                        : dict?.communityFeed?.failedToLoadDescription ||
                          "Something went wrong. Try again in a moment."}
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <div className="flex flex-col gap-3 w-full">
                    {state === "error" && onRetry && (
                        <Button variant="secondary" onClick={onRetry}>
                            {dict?.communityFeed?.retry || "Retry"}
                        </Button>
                    )}
                    <Button variant="outline" asChild>
                        <Link href={PATHS.DASHBOARD.COMMUNITY.ROOT}>
                            {dict?.communityFeed?.back || "Back to communities"}
                        </Link>
                    </Button>
                </div>
            </EmptyContent>
        </Empty>
    );
}