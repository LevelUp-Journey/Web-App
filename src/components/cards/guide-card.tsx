"use client";

import { Calendar, EllipsisVertical, Heart, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PATHS } from "@/lib/paths";
import { cn } from "@/lib/utils";
import type { Guide } from "@/services/internal/learning/guides/domain/guide.entity";

interface GuideCardProps extends React.ComponentProps<"div"> {
    guide: Guide;
    adminMode?: boolean;
}

export default function GuideCard({
    guide,
    adminMode = false,
    className,
    ...props
}: GuideCardProps) {
    const formattedDate = new Date(guide.createdAt).toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric",
        },
    );

    return (
        <Card
            key={guide.id}
            className={cn(
                "hover:shadow-lg transition-shadow overflow-hidden",
                className,
            )}
            {...props}
        >
            {/* Cover Image */}
            <Link
                href={PATHS.DASHBOARD.GUIDES.VIEW(guide.id)}
                className="block"
            >
                <div className="relative w-full aspect-video bg-muted">
                    {guide.coverImage ? (
                        <Image
                            src={guide.coverImage}
                            alt={guide.title}
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

            <CardHeader className="flex items-center justify-between flex-row">
                <CardTitle className="flex items-center justify-between">
                    <Link
                        href={PATHS.DASHBOARD.GUIDES.VIEW(guide.id)}
                        className="hover:underline"
                    >
                        {guide.title}
                    </Link>
                </CardTitle>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-sm">
                        <Button size="icon" variant="ghost">
                            <Heart className="text-red-400" size={18} />
                        </Button>
                        {guide.likesCount}
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
                                    <Link
                                        href={PATHS.DASHBOARD.ADMINISTRATION.GUIDES.EDIT(
                                            guide.id,
                                        )}
                                    >
                                        Edit Guide
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Delete Guide
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                    {adminMode && (
                        <div className="flex justify-between">
                            <span>Status:</span>
                            <span
                                className={cn(
                                    "px-2 py-1 rounded text-xs font-medium",
                                    guide.status === "PUBLISHED"
                                        ? "bg-green-100 text-green-800"
                                        : guide.status === "DRAFT"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-blue-100 text-blue-800",
                                )}
                            >
                                {guide.status}
                            </span>
                        </div>
                    )}
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={guide.createdAt}>{formattedDate}</time>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
