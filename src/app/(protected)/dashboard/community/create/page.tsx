"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CommunityForm } from "@/components/community/community-form";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";

export default function CreateCommunityPage() {
    const router = useRouter();
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkPermissions = async () => {
            try {
                const roles = await AuthController.getUserRoles();
                const role = roles.find(r => r === 'ROLE_TEACHER' || r === 'ROLE_ADMIN');
                setUserRole(role || null);
            } catch (error) {
                console.error("Error checking permissions:", error);
            } finally {
                setLoading(false);
            }
        };

        checkPermissions();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <div className="max-w-2xl mx-auto">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-64"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!userRole) {
        return (
            <div className="container mx-auto p-4">
                <div className="max-w-2xl mx-auto text-center space-y-4">
                    <h1 className="text-2xl font-semibold">Access Denied</h1>
                    <p className="text-muted-foreground">
                        You don't have permission to create communities.
                    </p>
                    <button
                        onClick={() => router.back()}
                        className="text-primary hover:underline"
                    >
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold">Create Community</h1>
                    <p className="text-muted-foreground">
                        Create a new community for your students or organization.
                    </p>
                </div>

                <CommunityForm
                    onSuccess={() => router.push('/dashboard/community')}
                    onCancel={() => router.back()}
                />
            </div>
        </div>
    );
}
