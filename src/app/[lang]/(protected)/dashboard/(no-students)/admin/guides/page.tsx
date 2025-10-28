"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { GuideResponse } from "@/services/internal/learning/guides/controller/guide.response";
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";

export default function GuidesPage() {
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [guides, setGuides] = useState<GuideResponse[]>([]);
    const [error, setError] = useState<string | null>(null);
    const PATHS = useLocalizedPaths();

    useEffect(() => {
        const checkPermissionsAndLoad = async () => {
            try {
                const roles = await AuthController.getUserRoles();
                const role = roles.find(
                    (r) => r === "ROLE_TEACHER" || r === "ROLE_ADMIN",
                );
                setUserRole(role || null);

                if (role) {
                    const guideList = await GuideController.getAllGuides();
                    setGuides(guideList);
                }
            } catch (err) {
                console.error("Error loading guides:", err);
                setError("Error loading guides");
            } finally {
                setLoading(false);
            }
        };

        checkPermissionsAndLoad();
    }, []);

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Guides</h2>
                </div>
                <div className="flex items-center justify-center min-h-[400px] text-muted-foreground">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (!userRole) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Guides</h2>
                </div>
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-semibold">Access Denied</h1>
                    <p className="text-muted-foreground">
                        You don't have permission to view guides.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Guides</h2>
                <Button asChild>
                    <Link href={PATHS.DASHBOARD.ADMINISTRATION.GUIDES.CREATE}>
                        Create Guide
                    </Link>
                </Button>
            </div>
            {error ? (
                <div className="flex items-center justify-center min-h-[400px] text-muted-foreground">
                    <p>{error}</p>
                </div>
            ) : guides.length === 0 ? (
                <div className="flex items-center justify-center min-h-[400px] text-muted-foreground">
                    <p>No guides created yet</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {guides.map((guide) => (
                        <Card key={guide.id}>
                            <CardHeader>
                                <CardTitle>{guide.title}</CardTitle>
                                <CardDescription>
                                    {guide.description || "No description"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Status:
                                        </span>
                                        <span
                                            className={`px-2 py-1 rounded text-xs ${
                                                guide.status === "PUBLISHED"
                                                    ? "bg-green-100 text-green-800"
                                                    : guide.status === "DRAFT"
                                                      ? "bg-yellow-100 text-yellow-800"
                                                      : "bg-blue-100 text-blue-800"
                                            }`}
                                        >
                                            {guide.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Likes: {guide.totalLikes}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Author: {guide.authorId}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Created:{" "}
                                        {new Date(
                                            guide.createdAt,
                                        ).toLocaleDateString()}
                                    </p>
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                        >
                                            <Link
                                                href={PATHS.DASHBOARD.ADMINISTRATION.GUIDES.VIEW(
                                                    guide.id,
                                                )}
                                            >
                                                View
                                            </Link>
                                        </Button>
                                        <Button asChild size="sm">
                                            <Link
                                                href={PATHS.DASHBOARD.ADMINISTRATION.GUIDES.EDIT(
                                                    guide.id,
                                                )}
                                            >
                                                Edit
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
