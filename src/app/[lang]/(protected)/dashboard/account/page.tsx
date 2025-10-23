"use client";

import { useState } from "react";
import ProfileCard from "@/components/profiles/profile-card";
import ProfileEditForm from "@/components/profiles/profile-edit-form";

export default function AccountPage() {
    const [isEditing, setIsEditing] = useState(false);

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
                    </>
                )}
            </div>
        </div>
    );
}
