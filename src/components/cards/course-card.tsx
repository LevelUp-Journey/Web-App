"use client";

import { Calendar, EllipsisVertical, ImageIcon, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PATHS } from "@/lib/paths";
import { cn } from "@/lib/utils";
import type { Course } from "@/services/internal/learning/courses/domain/course.entity";
import CourseDifficultyBadge from "./difficulty-badge";

interface CourseCardProps extends React.ComponentProps<"div"> {
    course: Course;
    adminMode?: boolean;
}

export default function CourseCard({
    course,
    adminMode = false,
    className,
    ...props
}: CourseCardProps) {
    const formattedDate = new Date(course.createdAt).toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric",
        },
    );

    const courseViewPath = adminMode
        ? PATHS.DASHBOARD.ADMINISTRATION.COURSES.VIEW(course.id)
        : PATHS.DASHBOARD.COURSES.VIEW(course.id);

    const courseEditPath = adminMode
        ? PATHS.DASHBOARD.ADMINISTRATION.COURSES.EDIT(course.id)
        : PATHS.DASHBOARD.COURSES.EDIT(course.id);

    return (
        <Card
            key={course.id}
            className={cn(
                "hover:shadow-lg transition-shadow overflow-hidden",
                className,
            )}
            {...props}
        >
            {/* Cover Image */}
            <Link href={courseViewPath} className="block">
                <div className="relative w-full aspect-video bg-muted">
                    {course.coverImage ? (
                        <Image
                            src={course.coverImage}
                            alt={course.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
                        </div>
                    )}
                </div>
            </Link>

            {/* Header */}
            <CardHeader className="flex items-center justify-between flex-row">
                <CardTitle className="flex items-center justify-between">
                    <Link href={courseViewPath} className="hover:underline">
                        {course.title}
                    </Link>
                </CardTitle>

                <div className="flex gap-2 items-center">
                    <div className="flex items-center gap-2 text-sm">
                        <Button size="icon" variant="ghost">
                            <Star className="text-yellow-400" size={18} />
                        </Button>
                        {course.likesCount}
                    </div>

                    {adminMode && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                    <EllipsisVertical />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href={courseEditPath}>
                                        Edit Course
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Delete Course
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </CardHeader>

            {/* Content */}
            <CardContent>
                <CardDescription>{course.description}</CardDescription>

                <div className="space-y-2 mt-3 text-sm text-muted-foreground">
                    {adminMode && (
                        <div className="flex justify-between">
                            <span>Status:</span>
                            <span
                                className={cn(
                                    "px-2 py-1 rounded text-xs font-medium",
                                    course.status === "PUBLISHED"
                                        ? "bg-green-100 text-green-800"
                                        : course.status === "DRAFT"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-blue-100 text-blue-800",
                                )}
                            >
                                {course.status}
                            </span>
                        </div>
                    )}
                    <CourseDifficultyBadge
                        difficulty={course.difficultyLevel}
                    />

                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={course.createdAt}>{formattedDate}</time>
                    </div>

                    <Button asChild className="w-full mt-3">
                        <Link href={courseViewPath}>View Course</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
