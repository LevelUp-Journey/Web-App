"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AvatarDropzone } from "@/components/auth/signup/avatar-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { PATHS } from "@/lib/paths";
import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";
import type {
    ProfileResponse,
    UpdateProfileRequest,
} from "@/services/internal/profiles/profiles/controller/profile.response";

export default function SignUpStep2() {
    const router = useRouter();

    const [userProfile, setUserProfile] = useState<ProfileResponse | null>(
        null,
    );
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [name, setName] = useState("");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Fetch profile on component mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await ProfileController.getCurrentUserProfile();
                console.log("Fetched profile:", profile);
                setUserProfile(profile);
                setName(profile?.username || "");
                setImageUrl(profile?.profileUrl || null);
            } catch (error) {
                console.error("Failed to load profile:", error);
                toast.error("Failed to load your profile. Please try again.");
            } finally {
                setIsLoadingProfile(false);
            }
        };

        fetchProfile();
    }, []);

    const handleImageUrlChange = (url: string) => {
        setImageUrl(url);
    };

    const onProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Please enter a name");
            return;
        }

        if (!userProfile) {
            toast.error("Profile not loaded. Please try again.");
            return;
        }

        setLoading(true);

        try {
            // Create FormData with the URL from Cloudinary (or current image)
            const data: UpdateProfileRequest = {
                username: name,
                profileUrl: imageUrl ? imageUrl : undefined,
            };

            await ProfileController.updateProfileByUserId(userProfile.id, data);

            toast.success("Profile updated successfully!");
            router.push(PATHS.DASHBOARD.ROOT);
        } catch (error) {
            console.error("Profile update error:", error);
            toast.error("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (isLoadingProfile) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Spinner className="size-6" />
                <p className="text-sm text-muted-foreground">
                    Loading your profile...
                </p>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
                <p className="text-sm text-destructive">
                    Failed to load your profile
                </p>
                <Button onClick={() => router.back()} variant="outline">
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={onProfileUpdate} className="flex flex-col gap-6">
            {/* Header */}
            <div className="text-center">
                <h1 className="mb-2 text-2xl font-semibold">
                    Complete Your Profile
                </h1>
                <p className="text-sm text-muted-foreground">
                    Add a photo and name to get started
                </p>
            </div>

            {/* Avatar Dropzone */}
            <AvatarDropzone
                onImageUrlChange={handleImageUrlChange}
                currentImage={imageUrl}
                disabled={loading}
            />

            {/* Name Input Section */}
            <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                    Your Name
                </label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                    You can change this anytime
                </p>
            </div>

            {/* Action Button */}
            <Button
                type="submit"
                disabled={loading || !name.trim()}
                size="lg"
                className="w-full"
            >
                {loading ? (
                    <>
                        <Spinner /> Creating Profile...
                    </>
                ) : (
                    "Start Your Adventure"
                )}
            </Button>
        </form>
    );
}
