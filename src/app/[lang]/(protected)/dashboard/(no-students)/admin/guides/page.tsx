"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import GuideCard from "@/components/cards/guide-card";
import { Button } from "@/components/ui/button";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";
import type { Guide } from "@/services/internal/learning/guides/domain/guide.entity";

export default function GuidesPage() {
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [guides, setGuides] = useState<Guide[]>([]);
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
                    const userId = await AuthController.getUserId();
                    const guideList =
                        await GuideController.getTeachersGuides(userId);
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
                        <GuideCard key={guide.id} guide={guide} adminMode />
                    ))}
                </div>
            )}
        </div>
    );
}
