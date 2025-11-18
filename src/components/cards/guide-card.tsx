"use client";

import { useEffect, useState } from "react";
import { Calendar, EllipsisVertical, Heart, ImageIcon, AlertTriangle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDictionary } from "@/hooks/use-dictionary";
import { PATHS } from "@/lib/paths";
import { cn } from "@/lib/utils";
import type { Guide } from "@/services/internal/learning/guides/domain/guide.entity";
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";

interface GuideCardProps extends React.ComponentProps<"div"> {
    guide: Guide;
    adminMode?: boolean;
    onDelete?: () => void;
}

export default function GuideCard({
    guide,
    adminMode = false,
    onDelete,
    className,
    ...props
}: GuideCardProps) {
    const dict = useDictionary();
    const router = useRouter();
    const [isLiked, setIsLiked] = useState(guide.likedByRequester);
    const [likesCount, setLikesCount] = useState(guide.likesCount);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    useEffect(() => {
        setIsLiked(guide.likedByRequester);
        setLikesCount(guide.likesCount);
    }, [guide.likedByRequester, guide.likesCount]);

    const formattedDate = new Date(guide.createdAt).toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric",
        },
    );

    const handleLikeGuide = async (guideId: string) => {
        const wasLiked = isLiked;
        setIsLiked(!wasLiked);
        setLikesCount((prev) => (wasLiked ? prev - 1 : prev + 1));

        try {
            if (wasLiked) {
                await GuideController.unlikeGuide(guideId);
            } else {
                await GuideController.likeGuide(guideId);
            }
        } catch (error) {
            setIsLiked(wasLiked);
            setLikesCount((prev) => (wasLiked ? prev + 1 : prev - 1));
            console.error("Failed to toggle like", error);
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        setShowDeleteDialog(false);
        setIsDeleting(true);

        try {
            await GuideController.deleteGuide({ id: guide.id });

            toast.success(
                dict?.challenges?.cards?.deleteGuideSuccess || "Guide deleted successfully"
            );

            if (onDelete) {
                onDelete();
            } else {
                router.refresh();
            }
        } catch (error) {
            console.error("Failed to delete guide:", error);
            const errorMessage = dict?.challenges?.cards?.deleteGuideError ||
                "Failed to delete guide. Please try again.";
            toast.error(errorMessage);
        } finally {
            setIsDeleting(false);
        }
    };

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
                    <Button
                        variant="ghost"
                        className="p-1"
                        onClick={() => handleLikeGuide(guide.id)}
                    >
                        <Heart
                            className={cn(
                                "text-red-400",
                                isLiked && "fill-current",
                            )}
                            size={18}
                        />
                        {likesCount}
                    </Button>
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
                                        {dict?.challenges?.cards?.editGuide ||
                                            "Edit Guide"}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={handleDeleteClick}
                                    disabled={isDeleting}
                                    className="text-destructive focus:text-destructive"
                                >
                                    {isDeleting
                                        ? dict?.challenges?.cards?.deleting || "Deleting..."
                                        : dict?.challenges?.cards?.deleteGuide || "Delete Guide"}
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
                            <span>
                                {dict?.challenges?.cards?.status || "Status"}:
                            </span>
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
                                {guide.status === "PUBLISHED"
                                    ? dict?.challenges?.cards?.published ||
                                      "Published"
                                    : guide.status === "DRAFT"
                                      ? dict?.challenges?.cards?.draft ||
                                        "Draft"
                                      : guide.status}
                            </span>
                        </div>
                    )}
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={guide.createdAt}>{formattedDate}</time>
                    </div>
                </div>
            </CardContent>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            {dict?.challenges?.cards?.deleteGuideTitle || "Delete Guide"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {dict?.challenges?.cards?.deleteGuideConfirm ||
                                "Are you sure you want to delete this guide? This action cannot be undone."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                            {dict?.challenges?.cards?.cancel || "Cancel"}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting
                                ? dict?.challenges?.cards?.deleting || "Deleting..."
                                : dict?.challenges?.cards?.deleteGuide || "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}
