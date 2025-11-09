"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/hooks/use-dictionary";
import { PATHS } from "@/lib/paths";
import { ChallengeController } from "@/services/internal/challenges/challenge/controller/challenge.controller";

interface DeleteChallengeButtonProps {
    challengeId: string;
}

export default function DeleteChallengeButton({
    challengeId,
}: DeleteChallengeButtonProps) {
    const router = useRouter();
    const dict = useDictionary();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const deleted =
                await ChallengeController.deleteChallenge(challengeId);

            if (!deleted) {
                toast.error(
                    dict?.errors?.permissions?.deleteChallenge ||
                        "You don't have permission to delete this challenge.",
                );
                return;
            }

            toast.success(
                dict?.challenges?.messages?.challengeDeleted ||
                    "Challenge deleted successfully",
            );
            router.push(PATHS.DASHBOARD.ADMINISTRATION.ROOT);
        } catch (error) {
            toast.error(
                dict?.errors?.deleting?.challenge ||
                    "Failed to delete challenge",
            );
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="destructive"
                    size="default"
                    disabled={isDeleting}
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isDeleting
                        ? dict?.challenges?.buttons?.deleting || "Deleting..."
                        : dict?.challenges?.buttons?.delete || "Delete"}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {dict?.challenges?.alerts?.deleteChallenge?.title ||
                            "Delete Challenge"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {dict?.challenges?.alerts?.deleteChallenge
                            ?.description ||
                            "Are you sure you want to delete this challenge? This action cannot be undone."}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        {dict?.challenges?.buttons?.cancel || "Cancel"}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting
                            ? dict?.challenges?.buttons?.deleting ||
                              "Deleting..."
                            : dict?.challenges?.buttons?.delete || "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
