import { Calendar, Heart, User } from "lucide-react";
import Image from "next/image";
import { serialize } from "next-mdx-remote-client/serialize";
import MdxRenderer from "@/components/challenges/mdx-renderer";
import { GuideAuthorCard } from "@/components/learning/guide-author-card";
import { GuideLikeButton } from "@/components/learning/guide-like-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";
import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";

interface GuidePageProps {
    params: Promise<{ guideId: string }>;
}

export default async function GuidePage({ params }: GuidePageProps) {
    const { guideId } = await params;

    // Fetch guide and author in parallel
    const guide = await GuideController.getGuideById(guideId);
    const author = await ProfileController.getProfileByUserId(guide.authorId);

    const serializedMarkdown = guide.markdownContent
        ? await serialize({ source: guide.markdownContent })
        : null;

    const formattedDate = new Date(guide.createdAt).toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric",
        },
    );

    const readingTime = calculateReadingTime(guide.markdownContent);

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section with Cover */}
            {guide.cover && (
                <div className="relative w-full h-[400px] bg-gradient-to-b from-muted to-background">
                    <Image
                        src={guide.cover}
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
                        guide.cover && "-mt-32 relative z-10",
                    )}
                >
                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                        <Badge
                            variant={
                                guide.status === "published"
                                    ? "default"
                                    : "secondary"
                            }
                            className="text-xs uppercase tracking-wider"
                        >
                            {guide.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                            {readingTime} min read
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                        {guide.title}
                    </h1>

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
                            <span>{guide.totalLikes} likes</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                        <GuideLikeButton
                            guideId={guide.id}
                            initialLikes={guide.totalLikes}
                        />
                    </div>
                </header>

                <Separator className="my-8" />

                {/* Main Content */}
                <article className="prose prose-neutral dark:prose-invert max-w-none pb-16">
                    {serializedMarkdown ? (
                        <MdxRenderer serializedSource={serializedMarkdown} />
                    ) : (
                        <p className="text-muted-foreground italic">
                            No content available for this guide.
                        </p>
                    )}
                </article>

                <Separator className="my-8" />

                {/* Author Card */}
                <aside className="py-8">
                    <GuideAuthorCard author={author} />
                </aside>
            </div>
        </div>
    );
}

// Helper function to calculate reading time
function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
}
