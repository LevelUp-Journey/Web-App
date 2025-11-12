"use client";

import {
    ArrowLeft,
    BookOpen,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Heart,
    Play,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { serialize } from "next-mdx-remote-client/serialize";
import { useEffect, useState } from "react";
import MdxRenderer from "@/components/challenges/mdx-renderer";
import { GuideLikeButton } from "@/components/learning/guide-like-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDictionary } from "@/hooks/use-dictionary";
import { useGuide } from "@/hooks/use-guide";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import { mdxOptions } from "@/lib/mdx-config";
import { cn } from "@/lib/utils";
import { ChallengeController } from "@/services/internal/challenges/challenge/controller/challenge.controller";
import type { Challenge } from "@/services/internal/challenges/challenge/entities/challenge.entity";
import type { GuideResponse } from "@/services/internal/learning/guides/controller/guide.response";
import type { ProfileResponse } from "@/services/internal/profiles/profiles/controller/profile.response";

interface GuideViewerProps {
    guide: GuideResponse;
    author: ProfileResponse;
}

export function GuideViewer({ guide, author }: GuideViewerProps) {
    console.log("GuideViewer", guide);
    const router = useRouter();
    const searchParams = useSearchParams();
    const pageParam = searchParams.get("page");
    const dict = useDictionary();
    const PATHS = useLocalizedPaths();

    // Usar hook personalizado para manejar el guide
    const { guide: storedGuide, author: storedAuthor } = useGuide({
        guideId: guide.id,
        guide,
        author,
    });

    // Estado para los challenges relacionados
    const [relatedChallenges, setRelatedChallenges] = useState<Challenge[]>([]);
    const [_loadingChallenges, setLoadingChallenges] = useState(false);

    // Determinar el índice de página actual basado en la URL
    const pageNumber = pageParam ? parseInt(pageParam, 10) : null;
    const currentPageIndex = pageNumber ? pageNumber - 1 : -1;

    // Validar que la página está en el rango válido
    const isValidPage =
        currentPageIndex >= 0 && currentPageIndex < storedGuide.pagesCount;
    const isReadingMode = pageNumber !== null && isValidPage;

    const formattedDate = new Date(storedGuide.createdAt).toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric",
        },
    );

    const totalReadingTime = storedGuide.pages.reduce((total, page) => {
        return total + calculateReadingTime(page.content);
    }, 0);

    const currentPage = isValidPage
        ? storedGuide.pages[currentPageIndex]
        : null;
    const hasPreviousPage = currentPageIndex > 0;
    const hasNextPage = currentPageIndex < storedGuide.pagesCount - 1;
    const isLastPage = currentPageIndex === storedGuide.pagesCount - 1;

    const handleNextPage = () => {
        if (hasNextPage) {
            const nextPage = currentPageIndex + 2; // +2 porque el índice es 0-based pero la URL es 1-based
            router.replace(`?page=${nextPage}`);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handlePreviousPage = () => {
        if (hasPreviousPage) {
            const prevPage = currentPageIndex; // currentPageIndex ya es el anterior en 1-based
            router.replace(`?page=${prevPage}`);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleBackToOverview = () => {
        router.replace(window.location.pathname);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleStartReading = () => {
        router.push(`?page=1`);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleGoToPage = (pageIndex: number) => {
        const pageNum = pageIndex + 1; // Convertir índice 0-based a número de página 1-based
        // Validar que la página está en el rango
        if (pageNum >= 1 && pageNum <= storedGuide.pagesCount) {
            router.replace(`?page=${pageNum}`);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    // Fetch related challenges
    useEffect(() => {
        const fetchRelatedChallenges = async () => {
            if (
                storedGuide.relatedChallenges &&
                storedGuide.relatedChallenges.length > 0
            ) {
                setLoadingChallenges(true);
                try {
                    const challenges = [];
                    for (const challengeId of storedGuide.relatedChallenges) {
                        const challenge =
                            await ChallengeController.getChallengeById(
                                challengeId,
                            );
                        if (challenge) {
                            challenges.push(challenge);
                        }
                    }
                    setRelatedChallenges(challenges);
                } catch (error) {
                    console.error("Error fetching related challenges:", error);
                } finally {
                    setLoadingChallenges(false);
                }
            }
        };

        fetchRelatedChallenges();
    }, [storedGuide.relatedChallenges]);

    // Si hay un parámetro de página pero no es válido, mostrar mensaje de error
    if (pageNumber !== null && !isValidPage) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">
                            {dict?.errors?.notFound || "Page Not Found"}
                        </h2>
                        <p className="text-muted-foreground">
                            {dict?.errors?.pageNotFound
                                ?.replace("{pageNumber}", pageNumber.toString())
                                ?.replace(
                                    "{totalPages}",
                                    storedGuide.pagesCount.toString(),
                                )
                                ?.replace(
                                    "{pagesPlural}",
                                    storedGuide.pagesCount !== 1 ? "s" : "",
                                ) ||
                                `The page number ${pageNumber} does not exist in this guide. This guide has ${storedGuide.pagesCount} page${storedGuide.pagesCount !== 1 ? "s" : ""}.`}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            {dict?.guides?.guidePageCount
                                ?.replace(
                                    "{count}",
                                    storedGuide.pagesCount.toString(),
                                )
                                ?.replace(
                                    "{unit}",
                                    storedGuide.pagesCount !== 1
                                        ? dict?.guides?.viewer?.pagePlural ||
                                              "pages"
                                        : dict?.guides?.viewer?.pageSingular ||
                                              "page",
                                ) ||
                                `This guide has ${storedGuide.pagesCount} page${storedGuide.pagesCount !== 1 ? "s" : ""}.`}
                        </p>
                    </div>
                    <Button onClick={handleBackToOverview}>
                        {dict?.guides?.viewer?.backToOverview ||
                            "Back to Overview"}
                    </Button>
                </div>
            </div>
        );
    }

    // Modo lectura: mostrar página específica
    if (isReadingMode && currentPage) {
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
                                        storedGuide.pagesCount.toString(),
                                    ) ||
                                    `Page ${currentPageIndex + 1} of ${storedGuide.pagesCount}`}
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
                    {isLastPage && relatedChallenges.length > 0 && (
                        <div className="mt-12 pt-8 border-t">
                            <h2 className="text-2xl font-bold mb-6">
                                {dict?.guides?.viewer?.practiceSection ||
                                    "Now you're ready to put it into practice:"}
                            </h2>
                            <div className="space-y-4">
                                {relatedChallenges.map((challenge) => (
                                    <div
                                        key={challenge.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <h3 className="font-semibold">
                                                {challenge.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {challenge.experiencePoints} XP
                                                •{" "}
                                                {challenge.difficulty ||
                                                    "Unknown"}{" "}
                                                •{" "}
                                                {challenge.tags
                                                    .map((tag) => tag.name)
                                                    .join(", ") || "No tags"}
                                            </p>
                                        </div>
                                        <Button asChild variant="outline">
                                            <Link
                                                href={PATHS.DASHBOARD.CHALLENGES.VIEW(
                                                    challenge.id,
                                                )}
                                                className="flex items-center gap-2"
                                            >
                                                <Play className="h-4 w-4" />
                                                {dict?.guides?.viewer
                                                    ?.startChallenge ||
                                                    "Start Challenge"}
                                            </Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-12 pt-8 border-t">
                        <Button
                            variant="outline"
                            onClick={handlePreviousPage}
                            disabled={!hasPreviousPage}
                            className="flex items-center gap-2"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            {dict?.guides?.viewer?.previousPage ||
                                "Previous Page"}
                        </Button>

                        <div className="flex items-center gap-2">
                            {Array.from(
                                { length: storedGuide.pagesCount },
                                (_, index) => (
                                    <button
                                        type="button"
                                        key={index}
                                        onClick={() => handleGoToPage(index)}
                                        className={cn(
                                            "w-2 h-2 rounded-full transition-colors",
                                            index === currentPageIndex
                                                ? "bg-primary"
                                                : "bg-muted-foreground/30 hover:bg-muted-foreground/50",
                                        )}
                                        aria-label={`Go to page ${index + 1}`}
                                    />
                                ),
                            )}
                        </div>

                        <Button
                            variant="outline"
                            onClick={handleNextPage}
                            disabled={!hasNextPage}
                            className="flex items-center gap-2"
                        >
                            {dict?.guides?.viewer?.nextPage || "Next Page"}
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Vista de presentación (Overview)
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section with Cover */}
            {storedGuide.coverImage && (
                <div className="relative w-full h-[400px] bg-gradient-to-b from-muted to-background">
                    <Image
                        src={storedGuide.coverImage}
                        alt={storedGuide.title}
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
                        storedGuide.coverImage && "-mt-32 relative z-10",
                    )}
                >
                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                        <Badge
                            variant={
                                storedGuide.status === "PUBLISHED"
                                    ? "default"
                                    : "secondary"
                            }
                            className="text-xs uppercase tracking-wider"
                        >
                            {dict?.guides?.viewer?.status?.[
                                storedGuide.status.toLowerCase()
                            ] || storedGuide.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                            {dict?.guides?.viewer?.minRead?.replace(
                                "{time}",
                                totalReadingTime.toString(),
                            ) || `${totalReadingTime} min read`}{" "}
                            • {storedGuide.pagesCount}{" "}
                            {storedGuide.pagesCount !== 1
                                ? dict?.guides?.viewer?.pagePlural || "pages"
                                : dict?.guides?.viewer?.pageSingular || "page"}
                        </span>
                    </div>

                    {/* Topics */}
                    {storedGuide.topics && storedGuide.topics.length > 0 && (
                        <div className="mt-4">
                            <div className="flex flex-wrap gap-2">
                                {storedGuide.topics.map((topic) => (
                                    <Badge key={topic.id} variant="outline">
                                        {topic.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                        {storedGuide.title}
                    </h1>

                    {/* Description */}
                    {storedGuide.description && (
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            {storedGuide.description}
                        </p>
                    )}

                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        {/* Author */}
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={storedAuthor.profileUrl} />
                                <AvatarFallback>
                                    {storedAuthor.firstName[0]}
                                    {storedAuthor.lastName[0]}
                                </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-foreground">
                                {storedAuthor.firstName} {storedAuthor.lastName}
                            </span>
                        </div>

                        <Separator orientation="vertical" className="h-4" />

                        {/* Date */}
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            <time dateTime={storedGuide.createdAt}>
                                {formattedDate}
                            </time>
                        </div>

                        <Separator orientation="vertical" className="h-4" />

                        {/* Likes */}
                        <div className="flex items-center gap-1.5">
                            <Heart className="h-4 w-4" />
                            <span>
                                {dict?.guides?.viewer?.likes?.replace(
                                    "{count}",
                                    storedGuide.likesCount.toString(),
                                ) || `${storedGuide.likesCount} likes`}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                        <GuideLikeButton
                            guideId={storedGuide.id}
                            initialLikes={storedGuide.likesCount}
                        />
                        {storedGuide.pagesCount > 0 && (
                            <Button
                                onClick={handleStartReading}
                                className="flex items-center gap-2"
                            >
                                <BookOpen className="h-4 w-4" />
                                {(() => {
                                    const unit =
                                        storedGuide.pagesCount !== 1
                                            ? dict?.guides?.viewer
                                                  ?.pagePlural || "pages"
                                            : dict?.guides?.viewer
                                                  ?.pageSingular || "page";
                                    return `${dict?.guides?.viewer?.readGuide || "Read Guide"} (${storedGuide.pagesCount} ${unit})`;
                                })()}
                            </Button>
                        )}
                    </div>
                </header>

                <Separator className="my-8" />
            </div>
        </div>
    );
}

// Client component for rendering page content with MDX
function PageContent({ content }: { content: string }) {
    const [serializedContent, setSerializedContent] = useState<Awaited<
        ReturnType<typeof serialize>
    > | null>(null);

    useEffect(() => {
        serialize({ source: content, ...mdxOptions }).then(
            setSerializedContent,
        );
    }, [content]);

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
