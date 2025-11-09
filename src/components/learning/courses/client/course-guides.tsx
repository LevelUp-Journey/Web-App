"use client";

import { BookOpen, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { getLocalizedPaths } from "@/hooks/use-localized-paths";
import type { Course } from "@/services/internal/learning/courses/domain/course.entity";

// Component for course guides list
export function CourseGuides({
    course,
    courseId,
    lang,
}: {
    course: Course;
    courseId: string;
    lang: string;
}) {
    const PATHS = getLocalizedPaths(lang as "en" | "es");

    if (!course.guides) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-lg">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No guides yet</h3>
                <p className="text-sm text-muted-foreground">
                    This course doesn't have any guides yet.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {course.guides.map((guide, index) => (
                <div key={guide.id} className="flex gap-3 items-start group">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary mt-2">
                        {index + 1}
                    </div>
                    <Link
                        href={PATHS.DASHBOARD.COURSES.GUIDES.VIEW(
                            courseId,
                            guide.id,
                        )}
                        className="flex-1 min-w-0"
                    >
                        <div className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                            <div className="flex items-start gap-4">
                                {guide.coverImage && (
                                    <div className="relative w-20 h-20 rounded-md overflow-hidden shrink-0">
                                        <Image
                                            src={guide.coverImage}
                                            alt={guide.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                                        {guide.title}
                                    </h3>
                                    {guide.description && (
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                            {guide.description}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <BookOpen className="h-3 w-3" />
                                            <span>
                                                {guide.pagesCount} pages
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Heart className="h-3 w-3" />
                                            <span>
                                                {guide.likesCount} likes
                                            </span>
                                        </div>
                                        <Badge
                                            variant={
                                                guide.status === "PUBLISHED"
                                                    ? "default"
                                                    : "secondary"
                                            }
                                            className="text-xs"
                                        >
                                            {guide.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}
