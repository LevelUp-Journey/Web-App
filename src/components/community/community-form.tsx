"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";

interface CommunityFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export function CommunityForm({ onSuccess, onCancel }: CommunityFormProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const userId = await AuthController.getUserId();
            const profile = await ProfileController.getProfileById(userId);
            await CommunityController.createCommunity({
                name,
                description,
                ownerId: userId,
                ownerProfileId: userId,
            });
            onSuccess();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to create community",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Community Name</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Community"}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
