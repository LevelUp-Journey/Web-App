"use client";

import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { CodeVersionController } from "@/services/internal/challenges/controller/code-version.controller";
import { Item, ItemActions, ItemContent, ItemTitle } from "../ui/item";
import type { CodeVersion } from "@/services/internal/challenges/entities/code-version.entity";

interface CodeVersionsListProps {
    challengeId: string;
    codeVersions: CodeVersion[];
}

export default function CodeVersionsList({
    challengeId,
    codeVersions,
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
                            <ItemTitle>{version.language}</ItemTitle>
                        </ItemContent>
                        <ItemActions>
                            <Button size="sm" variant="outline" asChild>
                                <Link
                                    href={`/dashboard/challenges/edit/${challengeId}/versions/${version.id}`}
                                >
                                    <Edit className="h-4 w-4" />
                                </Link>
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={deletingId === version.id}
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
                                            Are you sure you want to delete the{" "}
                                            {version.language} code version?
                                            This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() =>
                                                handleDelete(version.id)
                                            }
                                        >
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
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
