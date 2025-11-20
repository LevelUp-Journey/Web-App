"use client";

import { BookOpen, Calendar, Heart } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { GuideLikeButton } from "@/components/learning/guide-like-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDictionary } from "@/hooks/use-dictionary";
import { cn } from "@/lib/utils";
import type { GuideResponse } from "@/services/internal/learning/guides/controller/guide.response";
import type { ProfileResponse } from "@/services/internal/profiles/profiles/controller/profile.response";

// Helper function to calculate reading time
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

interface GuideOverviewProps {
  guide: GuideResponse;
  author: ProfileResponse;
  onStartReading: () => void;
}

export function GuideOverview({
  guide,
  author,
  onStartReading,
}: GuideOverviewProps) {
  const dict = useDictionary();

  const formattedDate = useMemo(
    () =>
      new Date(guide.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [guide.createdAt],
  );

  const totalReadingTime = useMemo(
    () =>
      guide.pages.reduce((total, page) => {
        return total + calculateReadingTime(page.content);
      }, 0),
    [guide.pages],
  );

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
              variant={guide.status === "PUBLISHED" ? "default" : "secondary"}
              className="text-xs uppercase tracking-wider"
            >
              {dict?.guides?.viewer?.status?.[guide.status.toLowerCase()] ||
                guide.status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {dict?.guides?.viewer?.minRead?.replace(
                "{time}",
                totalReadingTime.toString(),
              ) || `${totalReadingTime} min read`}{" "}
              • {guide.pagesCount}{" "}
              {guide.pagesCount !== 1
                ? dict?.guides?.viewer?.pagePlural || "pages"
                : dict?.guides?.viewer?.pageSingular || "page"}
            </span>
          </div>

          {/* Topics */}
          {guide.topics && guide.topics.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {guide.topics.map((topic) => (
                  <Badge key={topic.id} variant="outline">
                    {topic.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

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
              <time dateTime={guide.createdAt}>{formattedDate}</time>
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
                onClick={onStartReading}
                className="flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                {(() => {
                  const unit =
                    guide.pagesCount !== 1
                      ? dict?.guides?.viewer?.pagePlural || "pages"
                      : dict?.guides?.viewer?.pageSingular || "page";
                  return `${dict?.guides?.viewer?.readGuide || "Read Guide"} (${guide.pagesCount} ${unit})`;
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
