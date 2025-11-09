"use client";

import { Edit3, TestTube2, Trash2 } from "lucide-react";
import Link from "next/link";
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
import { CodeVersionController } from "@/services/internal/challenges/challenge/controller/code-version.controller";
import type { CodeVersion } from "@/services/internal/challenges/challenge/entities/code-version.entity";

interface CodeVersionsListProps {
    challengeId: string;
    codeVersions: CodeVersion[];
    variant?: "summary" | "editing";
    isTeacher?: boolean;
}

export default function CodeVersionsList({
    challengeId,
    codeVersions,
    variant = "editing",
    isTeacher = false,
}: CodeVersionsListProps) {
    const router = useRouter();
    const dict = useDictionary();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (codeVersionId: string) => {
        setDeletingId(codeVersionId);
        try {
            await CodeVersionController.deleteCodeVersion(
                challengeId,
                codeVersionId,
            );
            toast.success(
                dict?.challenges?.messages?.codeVersionDeleted ||
                    "Code version deleted successfully",
            );
            router.refresh();
        } catch (error) {
            console.error("Error deleting code version:", error);
            toast.error(
                dict?.errors?.deleting?.codeVersion ||
                    "Failed to delete code version",
            );
        } finally {
            setDeletingId(null);
        }
    };

    // Don't render anything for students in summary mode
    if (!isTeacher && variant === "summary") {
        return null;
    }

    return (
        <div className="space-y-2">
            {codeVersions.map((version) => (
                <div key={version.id} className="flex gap-2 justify-end">
                    {isTeacher && variant === "summary" ? (
                        <>
                            <Button size="default" variant="outline" asChild>
                                <Link
                                    href={PATHS.DASHBOARD.CHALLENGES.VERSIONS.VIEW(
                                        challengeId,
                                        version.id,
                                    )}
                                >
                                    <TestTube2 className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button size="default" variant="outline" asChild>
                                <Link href="?editing=true">
                                    <Edit3 className="h-4 w-4" />
                                </Link>
                            </Button>
                        </>
                    ) : isTeacher ? (
                        <>
                            <Button size="default" variant="outline" asChild>
                                <Link
                                    href={PATHS.DASHBOARD.CHALLENGES.VERSIONS.VIEW(
                                        challengeId,
                                        version.id,
                                    )}
                                >
                                    <Edit3 className="h-4 w-4" />
                                </Link>
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        size="default"
                                        variant="outline"
                                        disabled={deletingId === version.id}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            {dict?.challenges?.alerts
                                                ?.deleteCodeVersion?.title ||
                                                "Delete Code Version"}
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            {dict?.challenges?.alerts
                                                ?.deleteCodeVersion
                                                ?.description ||
                                                "Are you sure you want to delete this code version? This action cannot be undone."}
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            {dict?.common?.cancel || "Cancel"}
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() =>
                                                handleDelete(version.id)
                                            }
                                        >
                                            {dict?.common?.delete || "Delete"}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    ) : null}
                </div>
            ))}
            {codeVersions.length === 0 && (
                <p className="text-muted-foreground text-sm">
                    {dict?.challenges?.codeVersions?.noCodeVersions ||
                        'No code versions yet. Click "Add Code Version" to create one.'}
                </p>
            )}
        </div>
    );
}
