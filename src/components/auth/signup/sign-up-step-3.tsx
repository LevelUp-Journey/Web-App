"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AvatarDropzone } from "@/components/auth/signup/avatar-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useDictionary } from "@/hooks/use-dictionary";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import type { Dictionary } from "@/lib/i18n";
import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";
import type {
    ProfileResponse,
    UpdateProfileRequest,
} from "@/services/internal/profiles/profiles/controller/profile.response";

type FormData = {
    username: string;
};

interface SignUpStep3Props {
    dict?: Dictionary;
}

export default function SignUpStep3({ dict }: SignUpStep3Props) {
    const router = useRouter();
    const PATHS = useLocalizedPaths();
    const errorDict = useDictionary();

    const [userProfile, setUserProfile] = useState<ProfileResponse | null>(
        null,
    );
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Validation schema for username
    const usernameSchema = z
        .string()
        .trim()
        .min(
            1,
            dict?.auth.signUp.step3.validation.usernameEmpty ||
                "Username cannot be empty",
        )
        .max(
            30,
            dict?.auth.signUp.step3.validation.usernameTooLong ||
                "Username cannot exceed 30 characters",
        )
        .regex(
            /^[a-zA-Z0-9]+$/,
            dict?.auth.signUp.step3.validation.usernameInvalid ||
                "Username must contain only alphanumeric characters (letters and numbers), no spaces, maximum 30 characters",
        );

    const formSchema = z.object({
        username: usernameSchema,
    });

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isValid },
    } = form;

    // Load names from localStorage and fetch profile on component mount
    useEffect(() => {
        const loadData = async () => {
            try {
                // Load names from localStorage
                const storedFirstName =
                    localStorage.getItem("signup_firstName");
                const storedLastName = localStorage.getItem("signup_lastName");

                if (!storedFirstName || !storedLastName) {
                    // Redirect to step 2 if names are missing
                    router.push(PATHS.AUTH.SIGN_UP.STEP(2));
                    return;
                }

                // Fetch profile
                const profile = await ProfileController.getCurrentUserProfile();
                setUserProfile(profile);
                setImageUrl(profile?.profileUrl || null);

                // Set username: use existing profile username, or combine first/last names
                const suggestedUsername =
                    profile?.username ||
                    `${storedFirstName.trim()}${storedLastName.trim()}`;
                setValue("username", suggestedUsername);
            } catch (error) {
                console.error("Failed to load data:", error);
                toast.error(
                    dict?.auth.signUp.step3.profileLoadError ||
                        "Failed to load your profile. Please try again.",
                );
            } finally {
                setIsLoadingProfile(false);
            }
        };

        loadData();
    }, [router, setValue, PATHS]);

    const handleImageUrlChange = (url: string) => {
        setImageUrl(url);
    };

    const onProfileUpdate = async (data: FormData) => {
        if (!userProfile) {
            toast.error(
                dict?.auth.signUp.step3.profileNotLoaded ||
                    "Profile not loaded. Please try again.",
            );
            return;
        }

        setLoading(true);

        try {
            // Get names from localStorage
            const storedFirstName = localStorage.getItem("signup_firstName");
            const storedLastName = localStorage.getItem("signup_lastName");

            // Use the editable username
            const updateData: UpdateProfileRequest = {
                username: data.username.trim(),
                profileUrl: imageUrl ? imageUrl : undefined,
                firstName: storedFirstName || undefined,
                lastName: storedLastName || undefined,
            };

            await ProfileController.updateProfileByUserId(
                userProfile.id,
                updateData,
            );

            // Clear localStorage
            localStorage.removeItem("signup_firstName");
            localStorage.removeItem("signup_lastName");

            toast.success(
                dict?.auth.signUp.step3.profileUpdateSuccess ||
                    "Profile updated successfully!",
            );
            router.push(PATHS.DASHBOARD.ROOT);
        } catch (error) {
            console.error("Profile update error:", error);
            toast.error(
                dict?.auth.signUp.step3.profileUpdateError ||
                    "Failed to update profile. Please try again.",
            );
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        const redirection = PATHS.AUTH.SIGN_UP.STEP(2);
        router.push(redirection);
    };

    if (isLoadingProfile) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Spinner className="size-6" />
                <p className="text-sm text-muted-foreground">
                    {dict?.auth.signUp.step3.loadingProfile ||
                        "Loading your profile..."}
                </p>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
                <p className="text-sm text-destructive">
                    {dict?.auth.signUp.step3.profileLoadFailed ||
                        "Failed to load your profile"}
                </p>
                <Button onClick={() => router.back()} variant="outline">
                    {dict?.auth.signUp.step3.goBackButton || "Go Back"}
                </Button>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit(onProfileUpdate)}
            className="flex flex-col gap-6"
        >
            {/* Header */}
            <div className="text-center">
                <h1 className="mb-2 text-2xl font-semibold">
                    {dict?.auth.signUp.step3.title || "Complete Your Profile"}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {dict?.auth.signUp.step3.subtitle ||
                        "Add a photo to get started"}
                </p>
            </div>

            {/* Avatar Dropzone */}
            <AvatarDropzone
                onImageUrlChange={handleImageUrlChange}
                currentImage={imageUrl}
                disabled={loading}
            />

            {/* Username Input Section */}
            <div className="flex flex-col gap-2">
                <Label htmlFor="username" className="text-sm font-medium">
                    {dict?.auth.signUp.step3.usernameLabel || "Username"}
                </Label>
                <Input
                    id="username"
                    type="text"
                    placeholder={
                        dict?.auth.signUp.step3.usernamePlaceholder ||
                        "Enter your username"
                    }
                    disabled={loading}
                    {...register("username")}
                />
                {errors.username && (
                    <p className="text-sm text-destructive">
                        {errors.username.message}
                    </p>
                )}
                <p className="text-xs text-muted-foreground">
                    {dict?.auth.signUp.step3.usernameHelp ||
                        "This is how you'll appear to others. You can change this anytime."}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
                <Button
                    type="submit"
                    disabled={loading || !isValid}
                    size="lg"
                    className="w-full"
                >
                    {loading ? (
                        <>
                            <Spinner />{" "}
                            {dict?.auth.signUp.step3.creatingProfileButton ||
                                "Creating Profile..."}
                        </>
                    ) : (
                        dict?.auth.signUp.step3.startAdventureButton ||
                        "Start Your Adventure"
                    )}
                </Button>

                <Button
                    type="button"
                    onClick={handleBack}
                    variant="outline"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                >
                    {dict?.auth.signUp.step3.backButton || "Back"}
                </Button>
            </div>
        </form>
    );
}
