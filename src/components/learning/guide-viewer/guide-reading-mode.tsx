"use client";

import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/hooks/use-dictionary";
import type { GuideResponse } from "@/services/internal/learning/guides/controller/guide.response";
import { GuideChallenges } from "./guide-challenges";
import { GuideNavigation } from "./guide-navigation";
import { PageContent } from "./page-content";
import { useRelatedChallenges } from "./use-related-challenges";

interface GuideReadingModeProps {
    guide: GuideResponse;
    currentPageIndex: number;
    onBackToOverview: () => void;
    onNextPage: () => void;
    onPreviousPage: () => void;
    onGoToPage: (pageIndex: number) => void;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    isLastPage: boolean;
}

export function GuideReadingMode({
    guide,
    currentPageIndex,
    onBackToOverview,
    onNextPage,
    onPreviousPage,
    onGoToPage,
    hasPreviousPage,
    hasNextPage,
    isLastPage,
}: GuideReadingModeProps) {
    const dict = useDictionary();
    const relatedChallenges = useMemo(
        () => guide.relatedChallenges || [],
        [guide.relatedChallenges?.join(",")],
    );
    const { challenges } = useRelatedChallenges(relatedChallenges);
    const currentPage = guide.pages[currentPageIndex];

    return (
        <div className="min-h-screen bg-background">
            {/* Header with back button */}
            <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            onClick={onBackToOverview}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            {dict?.guides?.viewer?.backToOverview ||
                                "Back to Overview"}
                        </Button>
                        <div className="text-sm text-muted-foreground">
                            {dict?.guides?.viewer?.pageIndicator
                                ?.replace(
                                    "{current}",
                                    (currentPageIndex + 1).toString(),
                                )
                                ?.replace(
                                    "{total}",
                                    guide.pagesCount.toString(),
                                ) ||
                                `Page ${currentPageIndex + 1} of ${guide.pagesCount}`}
                        </div>
                    </div>
                </div>
            </div>

            {/* Page Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <article className="prose prose-neutral dark:prose-invert max-w-none">
                    <PageContent content={currentPage.content} />
                </article>

                {/* Challenges Section - Only on last page */}
                {isLastPage && <GuideChallenges challenges={challenges} />}

                {/* Navigation */}
                <GuideNavigation
                    currentPageIndex={currentPageIndex}
                    totalPages={guide.pagesCount}
                    onPreviousPage={onPreviousPage}
                    onNextPage={onNextPage}
                    onGoToPage={onGoToPage}
                    hasPreviousPage={hasPreviousPage}
                    hasNextPage={hasNextPage}
                />
            </div>
        </div>
    );
}
