"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useDictionary } from "@/hooks/use-dictionary";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import { CloudinaryController } from "@/services/external/cloudinary/cloudinary.controller";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import type { CreateCommunityRequest } from "@/services/internal/community/server/community.actions";

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

export default function CreateCommunityPage() {
    const router = useRouter();
    const PATHS = useLocalizedPaths();
    const dict = useDictionary();
    const [saving, setSaving] = useState(false);
    const [iconUrl, setIconUrl] = useState<string | undefined>();
    const [bannerUrl, setBannerUrl] = useState<string | undefined>();
    const [isUploadingIcon, setIsUploadingIcon] = useState(false);
    const [isUploadingBanner, setIsUploadingBanner] = useState(false);
    const iconInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    const formSchema = z.object({
        name: z
            .string()
            .min(
                COMMUNITY_LIMITS.NAME.MIN,
                dict?.admin.community.createForm?.validation?.nameRequired ||
                    "Community name is required",
            )
            .max(
                COMMUNITY_LIMITS.NAME.MAX,
                dict?.admin.community.createForm?.validation?.nameMax ||
                    `Community name must not exceed ${COMMUNITY_LIMITS.NAME.MAX} characters`,
            ),
        description: z
            .string()
            .min(
                COMMUNITY_LIMITS.DESCRIPTION.MIN,
                dict?.admin.community.createForm?.validation?.descriptionMin ||
                    `Description must be at least ${COMMUNITY_LIMITS.DESCRIPTION.MIN} characters`,
            )
            .max(
                COMMUNITY_LIMITS.DESCRIPTION.MAX,
                dict?.admin.community.createForm?.validation?.descriptionMax ||
                    `Description must not exceed ${COMMUNITY_LIMITS.DESCRIPTION.MAX} characters`,
            ),
        iconUrl: z.string().optional(),
        bannerUrl: z.string().optional(),
        isPrivate: z.boolean().default(false),
    });

    type FormData = z.infer<typeof formSchema>;

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            iconUrl: "",
            bannerUrl: "",
            isPrivate: false,
        },
    });

    const handleIconSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingIcon(true);
        try {
            const uploadedUrl = await CloudinaryController.uploadImage(
                file,
                "community-avatars",
            );
            setIconUrl(uploadedUrl);
            form.setValue("iconUrl", uploadedUrl);
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Error uploading image. Please try again.");
        } finally {
            setIsUploadingIcon(false);
        }
    };

    const handleBannerSelect = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

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
        if (iconInputRef.current) {
            iconInputRef.current.value = "";
        }
    };

    const handleRemoveBanner = () => {
        setBannerUrl(undefined);
        form.setValue("bannerUrl", "");
        if (bannerInputRef.current) {
            bannerInputRef.current.value = "";
        }
    };

    const onSubmit = async (data: FormData) => {
        setSaving(true);
        try {
            const request: CreateCommunityRequest = {
                name: data.name.trim(),
                description: data.description.trim(),
                iconUrl: data.iconUrl || undefined,
                bannerUrl: data.bannerUrl || undefined,
                isPrivate: data.isPrivate ?? false,
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
        router.push(PATHS.DASHBOARD.ADMINISTRATION.COMMUNITY.ROOT);
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
                        {/* Banner Upload */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <FormLabel className="text-sm font-bold uppercase text-muted-foreground">
                                    {dict?.admin.community.createForm
                                        ?.bannerLabel || "Banner"}
                                </FormLabel>
                                <span className="text-xs text-muted-foreground">
                                    1200x300 recommended
                                </span>
                            </div>
                            <div className="relative">
                                <input
                                    ref={bannerInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleBannerSelect}
                                    className="hidden"
                                    disabled={isUploadingBanner || saving}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        bannerInputRef.current?.click()
                                    }
                                    disabled={isUploadingBanner || saving}
                                    className="relative w-full h-32 rounded-lg border-2 border-dashed border-muted-foreground/50 hover:border-primary transition-colors flex items-center justify-center overflow-hidden bg-muted/30"
                                >
                                    {bannerUrl ? (
                                        <Image
                                            src={bannerUrl}
                                            alt="Community banner"
                                            fill
                                            sizes="100vw"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="text-center text-muted-foreground">
                                            <Camera className="w-6 h-6 mx-auto" />
                                            <span className="text-xs mt-1 block">
                                                {dict?.admin.community.createForm
                                                    ?.bannerPlaceholder ||
                                                    "Upload a banner"}
                                            </span>
                                        </div>
                                    )}
                                </button>

                                {bannerUrl && !isUploadingBanner && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveBanner}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}

                                {isUploadingBanner && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Icon Upload */}
                        <div className="flex justify-center">
                            <div className="relative">
                                <input
                                    ref={iconInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleIconSelect}
                                    className="hidden"
                                    disabled={isUploadingIcon || saving}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        iconInputRef.current?.click()
                                    }
                                    disabled={isUploadingIcon || saving}
                                    className="relative w-24 h-24 rounded-full border-2 border-dashed border-muted-foreground/50 hover:border-primary transition-colors flex items-center justify-center overflow-hidden bg-muted/30"
                                >
                                    {iconUrl ? (
                                        <Image
                                            src={iconUrl}
                                            alt="Community avatar"
                                            fill
                                            sizes="96px"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="text-center">
                                            <Camera className="w-8 h-8 mx-auto text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground mt-1 block">
                                                {dict?.admin.community.createForm
                                                    ?.iconPlaceholder ||
                                                    "Upload icon"}
                                            </span>
                                        </div>
                                    )}
                                </button>

                                {iconUrl && !isUploadingIcon && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveIcon}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}

                                {isUploadingIcon && (
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
                                    <div className="flex items-center justify-between">
                                        <FormLabel className="text-sm font-bold uppercase text-muted-foreground">
                                            {dict?.admin.community.createForm
                                                ?.nameLabel ||
                                                "Community Name"}{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </FormLabel>
                                        <span className="text-xs text-muted-foreground">
                                            {field.value?.length || 0}/
                                            {COMMUNITY_LIMITS.NAME.MAX}
                                        </span>
                                    </div>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={saving}
                                            maxLength={
                                                COMMUNITY_LIMITS.NAME.MAX
                                            }
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
                                    <div className="flex items-center justify-between">
                                        <FormLabel className="text-sm font-bold uppercase text-muted-foreground">
                                            {dict?.admin.community.createForm
                                                ?.descriptionLabel ||
                                                "Community Description"}{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </FormLabel>
                                        <span className="text-xs text-muted-foreground">
                                            {field.value?.length || 0}/
                                            {COMMUNITY_LIMITS.DESCRIPTION.MAX}
                                        </span>
                                    </div>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            disabled={saving}
                                            maxLength={
                                                COMMUNITY_LIMITS.DESCRIPTION.MAX
                                            }
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

                        <FormField
                            control={form.control}
                            name="isPrivate"
                            render={({ field }) => (
                                <FormItem className="flex items-start justify-between rounded-lg border p-4">
                                    <div className="space-y-1">
                                        <FormLabel className="text-sm font-bold uppercase text-muted-foreground">
                                            {dict?.admin.community.createForm
                                                ?.privacyLabel || "Privacy"}
                                        </FormLabel>
                                        <FormDescription className="text-xs">
                                            {dict?.admin.community.createForm
                                                ?.privacyDescription ||
                                                "Private communities are only visible to invited members."}
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={saving}
                                        />
                                    </FormControl>
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
