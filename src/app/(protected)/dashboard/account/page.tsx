"use client";

import { useState, useEffect } from "react";
import ProfileCard from "@/components/profiles/profile-card";
import ProfileEditForm from "@/components/profiles/profile-edit-form";
import CreateCommunityCard from "@/components/community/create-community-card";
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
                        <CreateCommunityCard userRole={userRole || undefined} />
                    </>
                )}
            </div>
        </div>
    );
}