"use client";

import { Trash2 } from "lucide-react";
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
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/lib/paths";
import { ChallengeController } from "@/services/internal/challenges/controller/challenge.controller";

interface DeleteChallengeButtonProps {
    challengeId: string;
}

export default function DeleteChallengeButton({
    challengeId,
}: DeleteChallengeButtonProps) {
    const router = useRouter();

    const handleDelete = async () => {
        try {
            await ChallengeController.deleteChallenge(challengeId);
            toast.success("Challenge deleted successfully");
            router.push(PATHS.DASHBOARD.CHALLENGES.ROOT);
        } catch (error) {
            toast.error("Failed to delete challenge");
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="default">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Challenge</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this challenge? This
                        action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
