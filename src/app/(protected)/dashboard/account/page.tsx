"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Users } from "lucide-react";
import ProfileCard from "@/components/profiles/profile-card";
import ProfileEditForm from "@/components/profiles/profile-edit-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";

export default function AccountPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const loadUserRole = async () => {
            try {
                const roles = await AuthController.getUserRoles();
                // Get the first role or check if user has TEACHER/ADMIN role
                const primaryRole = roles.find(role =>
                    role === 'ROLE_TEACHER' || role === 'ROLE_ADMIN'
                ) || roles[0];
                setUserRole(primaryRole || null);
            } catch (error) {
                console.error("Error loading user role:", error);
            }
        };

        loadUserRole();
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleSuccess = () => {
        setIsEditing(false);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="text-2xl font-semibold">Account Settings</h1>

                {isEditing ? (
                    <ProfileEditForm
                        onCancel={handleCancel}
                        onSuccess={handleSuccess}
                    />
                ) : (
                    <>
                        <ProfileCard
                            showEditButton={true}
                            onEdit={handleEdit}
                        />
                        {(userRole === 'ROLE_TEACHER' || userRole === 'ROLE_ADMIN') && (
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Users className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <h3 className="font-semibold">Create Community</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Start a new community
                                                </p>
                                            </div>
                                        </div>
                                        <Link href="/dashboard/community/create">
                                            <Button variant="outline" size="sm">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Create
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}