"use client";

import { Calendar, Heart, ChevronLeft, ChevronRight, BookOpen, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { serialize } from "next-mdx-remote-client/serialize";
import MdxRenderer from "@/components/challenges/mdx-renderer";
import { GuideAuthorCard } from "@/components/learning/guide-author-card";
import { GuideLikeButton } from "@/components/learning/guide-like-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { GuideResponse } from "@/services/internal/learning/guides/controller/guide.response";
import type { ProfileResponse } from "@/services/internal/profiles/profiles/controller/profile.response";

interface GuideViewerProps {
    guide: GuideResponse;
    author: ProfileResponse;
}

type ViewMode = "overview" | "pages";

export function GuideViewer({ guide, author }: GuideViewerProps) {
    const [viewMode, setViewMode] = useState<ViewMode>("overview");
    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    const formattedDate = new Date(guide.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const totalReadingTime = guide.pages.reduce((total, page) => {
        return total + calculateReadingTime(page.content);
    }, 0);

    const currentPage = guide.pages[currentPageIndex];
    const hasPreviousPage = currentPageIndex > 0;
    const hasNextPage = currentPageIndex < guide.pages.length - 1;

    const handleNextPage = () => {
        if (hasNextPage) {
            setCurrentPageIndex(currentPageIndex + 1);
        }
    };

    const handlePreviousPage = () => {
        if (hasPreviousPage) {
            setCurrentPageIndex(currentPageIndex - 1);
        }
    };

    const handleBackToOverview = () => {
        setViewMode("overview");
        setCurrentPageIndex(0);
    };

    if (viewMode === "pages" && currentPage) {
        return (
            <div className="min-h-screen bg-background">
                {/* Header with back button */}
                <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <Button
                                variant="ghost"
                                onClick={handleBackToOverview}
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Overview
                            </Button>
                            <div className="text-sm text-muted-foreground">
                                Page {currentPageIndex + 1} of {guide.pages.length}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <article className="prose prose-neutral dark:prose-invert max-w-none">
                        <PageContent content={currentPage.content} />
                    </article>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-12 pt-8 border-t">
                        <Button
                            variant="outline"
                            onClick={handlePreviousPage}
                            disabled={!hasPreviousPage}
                            className="flex items-center gap-2"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous Page
                        </Button>

                        <div className="flex items-center gap-2">
                            {guide.pages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentPageIndex(index)}
                                    className={cn(
                                        "w-2 h-2 rounded-full transition-colors",
                                        index === currentPageIndex
                                            ? "bg-primary"
                                            : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                                    )}
                                />
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            onClick={handleNextPage}
                            disabled={!hasNextPage}
                            className="flex items-center gap-2"
                        >
                            Next Page
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Overview view
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section with Cover */}
            {guide.coverImage && (
                <div className="relative w-full h-[400px] bg-gradient-to-b from-muted to-background">
                    <Image
                        src={guide.coverImage}
                        alt={guide.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                </div>
            )}

            {/* Content Container */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <header
                    className={cn(
                        "py-8 space-y-6",
                        guide.coverImage && "-mt-32 relative z-10",
                    )}
                >
                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                        <Badge
                            variant={
                                guide.status === "PUBLISHED"
                                    ? "default"
                                    : "secondary"
                            }
                            className="text-xs uppercase tracking-wider"
                        >
                            {guide.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                            {totalReadingTime} min read • {guide.pagesCount} pages
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                        {guide.title}
                    </h1>

                    {/* Description */}
                    {guide.description && (
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            {guide.description}
                        </p>
                    )}

                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        {/* Author */}
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={author.profileUrl} />
                                <AvatarFallback>
                                    {author.firstName[0]}
                                    {author.lastName[0]}
                                </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-foreground">
                                {author.firstName} {author.lastName}
                            </span>
                        </div>

                        <Separator orientation="vertical" className="h-4" />

                        {/* Date */}
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            <time dateTime={guide.createdAt}>
                                {formattedDate}
                            </time>
                        </div>

                        <Separator orientation="vertical" className="h-4" />

                        {/* Likes */}
                        <div className="flex items-center gap-1.5">
                            <Heart className="h-4 w-4" />
                            <span>{guide.likesCount} likes</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                        <GuideLikeButton
                            guideId={guide.id}
                            initialLikes={guide.likesCount}
                        />
                        {guide.pagesCount > 0 && (
                            <Button
                                onClick={() => setViewMode("pages")}
                                className="flex items-center gap-2"
                            >
                                <BookOpen className="h-4 w-4" />
                                Read Guide ({guide.pagesCount} pages)
                            </Button>
                        )}
                    </div>
                </header>

                <Separator className="my-8" />

                {/* Topics */}
                {guide.topics && guide.topics.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-4">Topics</h2>
                        <div className="flex flex-wrap gap-2">
                            {guide.topics.map((topic) => (
                                <Badge key={topic.id} variant="outline">
                                    {topic.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                <Separator className="my-8" />

                {/* Author Card */}
                <aside className="py-8">
                    <GuideAuthorCard author={author} />
                </aside>
            </div>
        </div>
    );
}

// Client component for rendering page content with MDX
function PageContent({ content }: { content: string }) {
    const [serializedContent, setSerializedContent] = useState<any>(null);

    useState(() => {
        serialize({ source: content }).then(setSerializedContent);
    });

    if (!serializedContent) {
        return <div className="animate-pulse">Loading content...</div>;
    }

    return <MdxRenderer serializedSource={serializedContent} />;
}

// Helper function to calculate reading time
function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
}