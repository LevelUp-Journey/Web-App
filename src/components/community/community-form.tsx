"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useDictionary } from "@/hooks/use-dictionary";
import { CloudinaryController } from "@/services/external/cloudinary/cloudinary.controller";
import { ImageUpload } from "./image-upload";

// Community form limits - easily configurable
const COMMUNITY_LIMITS = {
    NAME: {
        MIN: 1,
        MAX: 50,
    },
    DESCRIPTION: {
        MIN: 10,
        MAX: 150,
    },
} as const;

const communityFormSchema = z.object({
    name: z.string().min(1, "Community name is required").max(50),
    description: z.string().min(10).max(150),
    iconUrl: z.string().optional(),
    bannerUrl: z.string().optional(),
    isPrivate: z.boolean(),
});

export type CommunityFormData = z.infer<typeof communityFormSchema>;

interface CommunityFormProps {
    onSubmit: (data: CommunityFormData) => Promise<void>;
    onCancel: () => void;
    isSubmitting?: boolean;
    submitButtonText?: string;
    initialData?: Partial<CommunityFormData>;
}

export function CommunityForm({
    onSubmit,
    onCancel,
    isSubmitting = false,
    submitButtonText = "Create",
    initialData,
}: CommunityFormProps) {
    const dict = useDictionary();
    const [iconUrl, setIconUrl] = useState<string | undefined>(initialData?.iconUrl);
    const [bannerUrl, setBannerUrl] = useState<string | undefined>(initialData?.bannerUrl);
    const [isUploadingIcon, setIsUploadingIcon] = useState(false);
    const [isUploadingBanner, setIsUploadingBanner] = useState(false);

    const form = useForm<CommunityFormData>({
        resolver: zodResolver(communityFormSchema),
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
            iconUrl: initialData?.iconUrl || "",
            bannerUrl: initialData?.bannerUrl || "",
            isPrivate: initialData?.isPrivate || false,
        },
    });

    const handleIconSelect = async (file: File) => {
        setIsUploadingIcon(true);
        try {
            const uploadedUrl = await CloudinaryController.uploadImage(
                file,
                "community-avatars",
            );
            setIconUrl(uploadedUrl);
            form.setValue("iconUrl", uploadedUrl);
        } catch (error) {
            console.error("Error uploading icon:", error);
            alert("Error uploading icon. Please try again.");
        } finally {
            setIsUploadingIcon(false);
        }
    };

    const handleBannerSelect = async (file: File) => {
        setIsUploadingBanner(true);
        try {
            const uploadedUrl = await CloudinaryController.uploadImage(
                file,
                "community-banners",
            );
            setBannerUrl(uploadedUrl);
            form.setValue("bannerUrl", uploadedUrl);
        } catch (error) {
            console.error("Error uploading banner:", error);
            alert("Error uploading banner. Please try again.");
        } finally {
            setIsUploadingBanner(false);
        }
    };

    const handleRemoveIcon = () => {
        setIconUrl(undefined);
        form.setValue("iconUrl", "");
    };

    const handleRemoveBanner = () => {
        setBannerUrl(undefined);
        form.setValue("bannerUrl", "");
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Banner Upload */}
                <ImageUpload
                    value={bannerUrl}
                    onChange={(url) => {
                        setBannerUrl(url);
                        form.setValue("bannerUrl", url);
                    }}
                    onFileSelect={handleBannerSelect}
                    onRemove={handleRemoveBanner}
                    isUploading={isUploadingBanner}
                    disabled={isSubmitting}
                    label={dict?.admin.community.createForm?.bannerLabel || "Banner"}
                    placeholder={dict?.admin.community.createForm?.bannerPlaceholder || "Upload a banner"}
                    recommendedSize="1200x300 recommended"
                    variant="banner"
                />

                {/* Icon Upload */}
                <div className="flex justify-center">
                    <ImageUpload
                        value={iconUrl}
                        onChange={(url) => {
                            setIconUrl(url);
                            form.setValue("iconUrl", url);
                        }}
                        onFileSelect={handleIconSelect}
                        onRemove={handleRemoveIcon}
                        isUploading={isUploadingIcon}
                        disabled={isSubmitting}
                        placeholder={dict?.admin.community.createForm?.iconPlaceholder || "Upload icon"}
                        variant="icon"
                    />
                </div>

                {/* Community Name */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center justify-between">
                                <FormLabel className="text-sm font-bold uppercase text-muted-foreground">
                                    {dict?.admin.community.createForm?.nameLabel || "Community Name"}{" "}
                                    <span className="text-destructive">*</span>
                                </FormLabel>
                                <span className="text-xs text-muted-foreground">
                                    {field.value?.length || 0}/{COMMUNITY_LIMITS.NAME.MAX}
                                </span>
                            </div>
                            <FormControl>
                                <Input
                                    {...field}
                                    disabled={isSubmitting}
                                    maxLength={COMMUNITY_LIMITS.NAME.MAX}
                                    className="bg-background border-input"
                                    placeholder={dict?.admin.community.createForm?.namePlaceholder || "Enter community name"}
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
                            <div className="flex items-center justify-between">
                                <FormLabel className="text-sm font-bold uppercase text-muted-foreground">
                                    {dict?.admin.community.createForm?.descriptionLabel || "Community Description"}{" "}
                                    <span className="text-destructive">*</span>
                                </FormLabel>
                                <span className="text-xs text-muted-foreground">
                                    {field.value?.length || 0}/{COMMUNITY_LIMITS.DESCRIPTION.MAX}
                                </span>
                            </div>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    disabled={isSubmitting}
                                    maxLength={COMMUNITY_LIMITS.DESCRIPTION.MAX}
                                    rows={4}
                                    className="bg-background border-input resize-none"
                                    placeholder={dict?.admin.community.createForm?.descriptionPlaceholder || "Describe your community"}
                                />
                            </FormControl>
                            <FormDescription className="text-xs">
                                {dict?.admin.community.createForm?.descriptionHelper || "Tell people what this community is about"}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Privacy Setting */}
                <FormField
                    control={form.control}
                    name="isPrivate"
                    render={({ field }) => (
                        <FormItem className="flex items-start justify-between rounded-lg border p-4">
                            <div className="space-y-1">
                                <FormLabel className="text-sm font-bold uppercase text-muted-foreground">
                                    {dict?.admin.community.createForm?.privacyLabel || "Privacy"}
                                </FormLabel>
                                <FormDescription className="text-xs">
                                    {dict?.admin.community.createForm?.privacyDescription || "Private communities are only visible to invited members."}
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={isSubmitting}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                {/* Terms */}
                <p className="text-xs text-muted-foreground text-center">
                    {dict?.admin.community.createForm?.termsText || "By creating a community, you agree to the Community Guidelines."}
                </p>

                {/* Action Buttons */}
                <div className="flex justify-between pt-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        {dict?.common?.cancel || "Back"}
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? dict?.common?.loading || "Creating..." : submitButtonText}
                    </Button>
                </div>
            </form>
        </Form>
    );
}