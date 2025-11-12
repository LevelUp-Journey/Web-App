"use client";

import { Code, Edit3, Play, TestTube2, Trash2 } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDictionary } from "@/hooks/use-dictionary";
import { getReadableLanguageName } from "@/lib/consts";
import { PATHS } from "@/lib/paths";
import { CodeVersionController } from "@/services/internal/challenges/challenge/controller/code-version.controller";
import type { CodeVersion } from "@/services/internal/challenges/challenge/entities/code-version.entity";
import { SolutionsController } from "@/services/internal/challenges/solutions/controller/solutions.controller";

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
    const [selectedVersionId, setSelectedVersionId] = useState<string>(
        codeVersions.length > 0 ? codeVersions[0].id : "",
    );

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

    // Show code version selector for all users in summary mode
    if (variant === "summary") {
        return (
            <div className="space-y-4">
                <div className="space-y-3">
                    <h4 className="text-sm font-medium">
                        {dict?.challenges?.codeVersions?.selectVersion ||
                            "Select Code Version"}
                    </h4>
                    <div className="space-y-2">
                        {codeVersions.map((version) => (
                            <div
                                key={version.id}
                                className="flex items-center space-x-2"
                            >
                                <input
                                    type="radio"
                                    id={`version-${version.id}`}
                                    name="codeVersion"
                                    value={version.id}
                                    checked={selectedVersionId === version.id}
                                    onChange={(e) =>
                                        setSelectedVersionId(e.target.value)
                                    }
                                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary focus:ring-2"
                                />
                                <Label
                                    htmlFor={`version-${version.id}`}
                                    className="text-sm font-medium cursor-pointer"
                                >
                                    {getReadableLanguageName(version.language)}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                {codeVersions.length > 0 && (
                    <div className="flex gap-2">
                        <Button
                            size="lg"
                            onClick={() => {
                                if (selectedVersionId) {
                                    SolutionsController.createSolution({
                                        challengeId,
                                        codeVersionId: selectedVersionId,
                                    });
                                    router.push(
                                        `/editor/challenges/${challengeId}/version/${selectedVersionId}`,
                                    );
                                }
                            }}
                            disabled={!selectedVersionId}
                        >
                            <Play className="h-4 w-4 mr-2" />
                            {dict?.challenges?.codeVersions?.playVersion ||
                                "Play"}
                        </Button>

                        {isTeacher && (
                            <>
                                <Button size="lg" variant="outline" asChild>
                                    <Link
                                        href={PATHS.DASHBOARD.CHALLENGES.VERSIONS.VIEW(
                                            challengeId,
                                            selectedVersionId,
                                        )}
                                    >
                                        <TestTube2 className="h-4 w-4 mr-2" />
                                        {dict?.challenges?.codeVersions
                                            ?.manageTests || "Tests"}
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild>
                                    <Link href="?editing=true">
                                        <Edit3 className="h-4 w-4 mr-2" />
                                        {dict?.challenges?.edit || "Edit"}
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>
                )}

                {codeVersions.length === 0 && (
                    <p className="text-muted-foreground text-sm">
                        {dict?.challenges?.codeVersions?.noCodeVersions ||
                            'No code versions yet. Click "Add Code Version" to create one.'}
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {codeVersions.map((version) => (
                <div
                    key={version.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors shadow-sm"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                            <Code className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <span className="font-semibold text-foreground">
                                {getReadableLanguageName(version.language)}
                            </span>
                            <p className="text-sm text-muted-foreground">
                                {dict?.challenges?.codeVersions?.language ||
                                    "Programming Language"}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {isTeacher ? (
                            <>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            asChild
                                        >
                                            <Link
                                                href={PATHS.DASHBOARD.CHALLENGES.VERSIONS.VIEW(
                                                    challengeId,
                                                    version.id,
                                                )}
                                            >
                                                <Edit3 className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>
                                            {dict?.challenges?.codeVersions
                                                ?.edit || "Edit Version"}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={
                                                        deletingId ===
                                                        version.id
                                                    }
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        {dict?.challenges
                                                            ?.alerts
                                                            ?.deleteCodeVersion
                                                            ?.title ||
                                                            "Delete Code Version"}
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        {dict?.challenges
                                                            ?.alerts
                                                            ?.deleteCodeVersion
                                                            ?.description ||
                                                            "Are you sure you want to delete this code version? This action cannot be undone."}
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        {dict?.common?.cancel ||
                                                            "Cancel"}
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            handleDelete(
                                                                version.id,
                                                            )
                                                        }
                                                    >
                                                        {dict?.common?.delete ||
                                                            "Delete"}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>
                                            {dict?.challenges?.codeVersions
                                                ?.delete || "Delete Version"}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </>
                        ) : null}
                    </div>
                </div>
            ))}
            {codeVersions.length === 0 && (
                <div className="text-center py-8">
                    <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-sm">
                        {dict?.challenges?.codeVersions?.noCodeVersions ||
                            'No code versions yet. Click "Add Code Version" to create one.'}
                    </p>
                </div>
            )}
        </div>
    );
}
