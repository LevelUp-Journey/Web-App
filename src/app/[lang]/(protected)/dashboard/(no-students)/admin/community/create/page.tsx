"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDictionary } from "@/hooks/use-dictionary";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import { CloudinaryController } from "@/services/external/cloudinary/cloudinary.controller";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import type { CreateCommunityRequest } from "@/services/internal/community/server/community.actions";

export default function CreateCommunityPage() {
    const router = useRouter();
    const PATHS = useLocalizedPaths();
    const dict = useDictionary();
    const [saving, setSaving] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | undefined>();
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formSchema = z.object({
        name: z
            .string()
            .min(
                1,
                dict?.admin.community.createForm?.validation?.nameRequired ||
                    "Community name is required",
            )
            .max(
                100,
                dict?.admin.community.createForm?.validation?.nameMax ||
                    "Community name must not exceed 100 characters",
            ),
        description: z
            .string()
            .min(
                10,
                dict?.admin.community.createForm?.validation?.descriptionMin ||
                    "Description must be at least 10 characters",
            )
            .max(
                500,
                dict?.admin.community.createForm?.validation?.descriptionMax ||
                    "Description must not exceed 500 characters",
            ),
        imageUrl: z.string().optional(),
    });

    type FormData = z.infer<typeof formSchema>;

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            imageUrl: "",
        },
    });

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingImage(true);
        try {
            const uploadedUrl = await CloudinaryController.uploadImage(
                file,
                "community-avatars",
            );
            setImageUrl(uploadedUrl);
            form.setValue("imageUrl", uploadedUrl);
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Error uploading image. Please try again.");
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleRemoveImage = () => {
        setImageUrl(undefined);
        form.setValue("imageUrl", "");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const onSubmit = async (data: FormData) => {
        setSaving(true);
        try {
            const request: CreateCommunityRequest = {
                name: data.name,
                description: data.description,
                imageUrl: data.imageUrl,
            };

            const response = await CommunityController.createCommunity(request);

            if (response) {
                router.push(PATHS.DASHBOARD.ADMINISTRATION.COMMUNITY.ROOT);
            } else {
                alert(
                    dict?.admin.community.createForm?.errorCreating ||
                        "Error creating community. Please try again.",
                );
            }
        } catch (error) {
            console.error("Error creating community:", error);
            alert(
                dict?.admin.community.createForm?.errorCreating ||
                    "Error creating community. Please try again.",
            );
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (
            confirm(
                dict?.admin.community.createForm?.cancelConfirm ||
                    "Are you sure you want to cancel? All progress will be lost.",
            )
        ) {
            router.push(PATHS.DASHBOARD.ADMINISTRATION.COMMUNITY.ROOT);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
            <div className="w-full max-w-md bg-card rounded-lg shadow-lg p-8">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold">
                        {dict?.admin.community.createForm?.title ||
                            "Customize Your Community"}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        {dict?.admin.community.createForm?.subtitle ||
                            "Give your new community a personality with a name and an icon. You can always change it later."}
                    </p>
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Image Upload */}
                        <div className="flex justify-center">
                            <div className="relative">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                    disabled={isUploadingImage || saving}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    disabled={isUploadingImage || saving}
                                    className="relative w-24 h-24 rounded-full border-2 border-dashed border-muted-foreground/50 hover:border-primary transition-colors flex items-center justify-center overflow-hidden bg-muted/30"
                                >
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt="Community avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-center">
                                            <Camera className="w-8 h-8 mx-auto text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground mt-1 block">
                                                UPLOAD
                                            </span>
                                        </div>
                                    )}
                                </button>

                                {imageUrl && !isUploadingImage && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}

                                {isUploadingImage && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Community Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold uppercase text-muted-foreground">
                                        {dict?.admin.community.createForm
                                            ?.nameLabel || "Community Name"}{" "}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={saving}
                                            className="bg-background border-input"
                                            placeholder={
                                                dict?.admin.community.createForm
                                                    ?.namePlaceholder ||
                                                "Enter community name"
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Community Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold uppercase text-muted-foreground">
                                        {dict?.admin.community.createForm
                                            ?.descriptionLabel ||
                                            "Community Description"}{" "}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            disabled={saving}
                                            rows={4}
                                            className="bg-background border-input resize-none"
                                            placeholder={
                                                dict?.admin.community.createForm
                                                    ?.descriptionPlaceholder ||
                                                "Describe your community"
                                            }
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        {dict?.admin.community.createForm
                                            ?.descriptionHelper ||
                                            "Tell people what this community is about"}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Terms */}
                        <p className="text-xs text-muted-foreground text-center">
                            {dict?.admin.community.createForm?.termsText ||
                                "By creating a community, you agree to the Community Guidelines."}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex justify-between pt-4">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleCancel}
                                disabled={saving}
                            >
                                {dict?.common?.cancel || "Back"}
                            </Button>
                            <Button type="submit" disabled={saving}>
                                {saving
                                    ? dict?.common?.loading || "Creating..."
                                    : dict?.admin.community.createForm
                                            ?.submitButton || "Create"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
