"use client";

import { ChevronRight, EllipsisVertical, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ChallengeDifficultyBadge from "@/components/cards/challenge-difficulty-badge";
import FullLanguageBadge from "@/components/cards/full-language-badge";
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
import { useDictionary } from "@/hooks/use-dictionary";
import { ChallengeDifficulty, type ProgrammingLanguage } from "@/lib/consts";
import { PATHS } from "@/lib/paths";
import { cn } from "@/lib/utils";
import { ChallengeController } from "@/services/internal/challenges/challenge/controller/challenge.controller";
import type { Challenge } from "@/services/internal/challenges/challenge/entities/challenge.entity";
import type { CodeVersion } from "@/services/internal/challenges/challenge/entities/code-version.entity";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface ChallengeCardProps extends React.ComponentProps<"div"> {
    challenge: Challenge;
    codeVersions: CodeVersion[];
    adminMode?: boolean;
}

export default function ChallengeCard({
    challenge,
    codeVersions,
    adminMode = false,
    className,
    ...props
}: ChallengeCardProps) {
    const router = useRouter();
    const dict = useDictionary();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isLiked, setIsLiked] = useState(challenge.userLiked ?? false);
    const [likesCount, setLikesCount] = useState(
        challenge.likesCount ?? challenge.stars.length,
    );

    useEffect(() => {
        setIsLiked(challenge.userLiked ?? false);
        setLikesCount(challenge.likesCount ?? challenge.stars.length);
    }, [challenge.userLiked, challenge.likesCount, challenge.stars.length]);

    const handleLike = async () => {
        const wasLiked = isLiked;
        setIsLiked(!wasLiked);
        setLikesCount((prev) => (wasLiked ? prev - 1 : prev + 1));

        try {
            if (wasLiked) {
                await ChallengeController.unlikeChallenge(challenge.id);
            } else {
                await ChallengeController.likeChallenge(challenge.id);
            }
        } catch (error) {
            setIsLiked(wasLiked);
            setLikesCount((prev) => (wasLiked ? prev + 1 : prev - 1));
            console.error("Failed to toggle like", error);
        }
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const deleted = await ChallengeController.deleteChallenge(
                challenge.id,
            );

            if (!deleted) {
                toast.error(
                    dict?.errors?.permissions?.deleteChallenge ||
                        "You don't have permission to delete this challenge.",
                );
                return;
            }

            toast.success("Challenge deleted successfully");
            router.refresh();
        } catch (error) {
            toast.error(
                dict?.errors?.deleting?.challenge ||
                    "Failed to delete challenge",
            );
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    return (
        <Card
            key={challenge.id}
            className={cn(
                "hover:shadow-lg transition-shadow flex flex-col py-4 gap-2",
                className,
            )}
            {...props}
        >
            {/* Badges at the top */}
            <CardHeader className="px-4">
                <div className="flex gap-2">
                    <ChallengeDifficultyBadge
                        difficulty={
                            challenge.difficulty ?? ChallengeDifficulty.EASY
                        }
                    />
                    {codeVersions.map((version) => (
                        <FullLanguageBadge
                            key={version.id}
                            language={version.language as ProgrammingLanguage}
                        />
                    ))}
                </div>
            </CardHeader>

            <CardContent className="px-4">
                {/* Title in the middle */}
                <CardTitle className="text-base font-bold">
                    {challenge.name}
                </CardTitle>

                {/* Stars at the bottom */}
                <div className="flex items-center justify-between">
                    <Button size={"sm"} variant={"ghost"} onClick={handleLike}>
                        <Star
                            className={cn(
                                "text-yellow-400",
                                isLiked && "fill-current",
                            )}
                            size={14}
                        />
                        <span className="text-xs">{likesCount}</span>
                    </Button>
                    <div className="flex items-center gap-1">
                        <Button size={"icon"} variant={"ghost"} asChild>
                            <Link
                                href={PATHS.DASHBOARD.CHALLENGES.VIEW(
                                    challenge.id,
                                )}
                            >
                                <ChevronRight size={14} />
                            </Link>
                        </Button>
                        {adminMode && (
                            <>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            size={"sm"}
                                            variant={"ghost"}
                                            className="h-6 w-6 p-0"
                                        >
                                            <EllipsisVertical size={14} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href={PATHS.DASHBOARD.CHALLENGES.VIEW(
                                                    challenge.id,
                                                )}
                                            >
                                                {dict?.challenges?.cards
                                                    ?.editChallenge ||
                                                    "Edit Challenge"}
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                setShowDeleteDialog(true)
                                            }
                                            className="text-destructive focus:text-destructive cursor-pointer"
                                        >
                                            {dict?.challenges?.cards
                                                ?.deleteChallenge ||
                                                "Delete Challenge"}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <AlertDialog
                                    open={showDeleteDialog}
                                    onOpenChange={setShowDeleteDialog}
                                >
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                {dict?.challenges?.alerts
                                                    ?.deleteChallenge?.title ||
                                                    "Delete Challenge"}
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                {dict?.challenges?.alerts?.deleteChallenge?.description?.replace(
                                                    "this challenge",
                                                    `"${challenge.name}"`,
                                                ) ||
                                                    `Are you sure you want to delete "${challenge.name}"? This action cannot be undone.`}
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel
                                                disabled={isDeleting}
                                            >
                                                {dict?.common?.cancel ||
                                                    "Cancel"}
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={handleDelete}
                                                disabled={isDeleting}
                                                className="bg-destructive hover:bg-destructive/90"
                                            >
                                                {isDeleting
                                                    ? dict?.challenges?.buttons
                                                          ?.deleting ||
                                                      "Deleting..."
                                                    : dict?.challenges?.buttons
                                                          ?.delete || "Delete"}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
