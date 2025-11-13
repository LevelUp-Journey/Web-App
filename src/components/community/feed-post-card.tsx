"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import type { FeedItem } from "@/hooks/use-personalized-feed";
import { MarkdownContent } from "./community-feed/markdown-content";

interface FeedPostCardProps {
  feedItem: FeedItem;
  dict: Dictionary;
  currentUserId?: string;
  formatDate: (date: string | Date) => string;
}

export function FeedPostCard({
  feedItem,
  dict,
  currentUserId = "",
  formatDate,
}: FeedPostCardProps) {
  const [isLiking, setIsLiking] = useState(false);
  const PATHS = useLocalizedPaths();

  // Use local state for reactions to avoid reloading the entire page
  const [hasUserLiked, setHasUserLiked] = useState(
    feedItem.reactions?.userReaction === "LIKE",
  );
  const [likeCount, setLikeCount] = useState(
    feedItem.reactions?.reactionCounts?.LIKE || 0,
  );

  const handleToggleLike = async () => {
    if (isLiking || !currentUserId) return;

    try {
      setIsLiking(true);

      // Optimistic update
      const wasLiked = hasUserLiked;
      const previousCount = likeCount;

      if (hasUserLiked) {
        // Optimistically update UI
        setHasUserLiked(false);
        setLikeCount((prev) => Math.max(0, prev - 1));

        // Unlike: DELETE /api/community/reactions with postId
        const response = await fetch("/api/community/reactions", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            postId: feedItem.id,
          }),
        });

        if (!response.ok && response.status !== 404) {
          // Revert on error
          setHasUserLiked(wasLiked);
          setLikeCount(previousCount);
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to unlike");
        }
      } else {
        // Optimistically update UI
        setHasUserLiked(true);
        setLikeCount((prev) => prev + 1);

        // Like: POST /api/community/reactions
        const response = await fetch("/api/community/reactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            postId: feedItem.id,
            reactionType: "LIKE",
          }),
        });

        if (!response.ok && response.status !== 409) {
          // Revert on error
          setHasUserLiked(wasLiked);
          setLikeCount(previousCount);
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to like");
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Card className="border-muted">
      <CardHeader className="gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="rounded-lg">
              <AvatarImage
                src={feedItem.authorProfileUrl ?? undefined}
                alt={feedItem.authorName}
              />
              <AvatarFallback>
                {feedItem.authorName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <CardDescription className="text-xs">
                  {feedItem.authorName} · {formatDate(feedItem.createdAt)}
                </CardDescription>
              </div>
              <Link
                href={`${PATHS.DASHBOARD.COMMUNITY.ROOT}/${feedItem.communityId}`}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                {feedItem.communityImageUrl && (
                  <Avatar className="size-5 rounded-md">
                    <AvatarImage
                      src={feedItem.communityImageUrl}
                      alt={feedItem.communityName}
                    />
                    <AvatarFallback className="text-[10px]">
                      {feedItem.communityName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <Badge variant="secondary" className="text-xs font-normal">
                  {feedItem.communityName}
                </Badge>
              </Link>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <MarkdownContent content={feedItem.content} />

        {feedItem.imageUrl && (
          <div className="relative rounded-lg overflow-hidden border min-h-[200px] w-full">
            <Image
              src={feedItem.imageUrl}
              alt="Post image"
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover"
            />
          </div>
        )}

        {/* Reactions Section */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            variant={hasUserLiked ? "default" : "outline"}
            size="sm"
            onClick={handleToggleLike}
            disabled={isLiking}
            className="gap-1.5"
          >
            <Heart className={`size-4 ${hasUserLiked ? "fill-current" : ""}`} />
            <span className="text-xs">{likeCount}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
