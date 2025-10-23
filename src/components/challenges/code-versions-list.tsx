"use client";

import { Edit, Eye, Play, Trash2 } from "lucide-react";
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
import {
    Item,
    ItemActions,
    ItemContent,
    ItemTitle,
} from "@/components/ui/item";
import { getReadableLanguageName } from "@/lib/consts";
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
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (codeVersionId: string) => {
        setDeletingId(codeVersionId);
        try {
            await CodeVersionController.deleteCodeVersion(
                challengeId,
                codeVersionId,
            );
            toast.success("Code version deleted successfully");
            router.refresh();
        } catch (error) {
            console.error("Error deleting code version:", error);
            toast.error("Failed to delete code version");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Code Versions</h2>
            <div className="space-y-2">
                {codeVersions.map((version) => (
                    <Item key={version.id} variant="muted" size="sm">
                        <ItemContent>
                            <ItemTitle>
                                {getReadableLanguageName(version.language)}
                            </ItemTitle>
                        </ItemContent>
                        <ItemActions>
                            {isTeacher ? (
                                variant === "summary" ? (
                                    <Button
                                        size="default"
                                        variant="outline"
                                        asChild
                                    >
                                        <Link
                                            href={PATHS.DASHBOARD.CHALLENGES.VERSIONS.VIEW(
                                                challengeId,
                                                version.id,
                                            )}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            size="default"
                                            variant="outline"
                                            asChild
                                        >
                                            <Link
                                                href={PATHS.DASHBOARD.CHALLENGES.VERSIONS.VIEW(
                                                    challengeId,
                                                    version.id,
                                                )}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    size="default"
                                                    variant="outline"
                                                    disabled={
                                                        deletingId ===
                                                        version.id
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Delete Code Version
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to
                                                        delete the{" "}
                                                        {getReadableLanguageName(
                                                            version.language,
                                                        )}{" "}
                                                        code version? This
                                                        action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            handleDelete(
                                                                version.id,
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </>
                                )
                            ) : (
                                <Button
                                    size="default"
                                    variant="outline"
                                    asChild
                                >
                                    <Link
                                        href={`/editor/challenges/${challengeId}/version/${version.id}`}
                                    >
                                        <Play className="h-4 w-4 mr-2" />
                                        Start Challenge
                                    </Link>
                                </Button>
                            )}
                        </ItemActions>
                    </Item>
                ))}
                {codeVersions.length === 0 && (
                    <p className="text-muted-foreground text-sm">
                        No code versions yet. Click "Add Code Version" to create
                        one.
                    </p>
                )}
            </div>
        </div>
    );
}
