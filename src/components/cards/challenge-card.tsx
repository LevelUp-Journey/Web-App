"use client";

import { ChevronRight, EllipsisVertical, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { Card, CardTitle } from "@/components/ui/card";
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
        } catch (_error) {
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
                "hover:shadow-lg transition-shadow flex flex-col",
                className,
            )}
            {...props}
        >
            {/* Badges at the top */}
            <div className="px-3 py-1 pb-0.5">
                <div className="flex flex-wrap gap-1">
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
            </div>

            {/* Title in the middle */}
            <div className="flex items-center px-3 py-2">
                <CardTitle className="text-base font-bold">
                    {challenge.name}
                </CardTitle>
            </div>

            {/* Stars at the bottom */}
            <div className="px-3 py-1 pt-0.5 flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <Button
                        size={"sm"}
                        variant={"ghost"}
                        className="h-6 w-6 p-0"
                    >
                        <Star className="text-yellow-400" size={14} />
                    </Button>
                    <span className="text-xs">{challenge.stars.length}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        size={"sm"}
                        variant={"ghost"}
                        className="h-6 w-6 p-0"
                        asChild
                    >
                        <Link
                            href={PATHS.DASHBOARD.CHALLENGES.VIEW(challenge.id)}
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
                                            {dict?.common?.cancel || "Cancel"}
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
        </Card>
    );
}
