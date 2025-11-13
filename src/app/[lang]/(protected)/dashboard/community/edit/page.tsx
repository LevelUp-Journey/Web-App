"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Trash2, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CommunityCard from "@/components/community/community-card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useDictionary } from "@/hooks/use-dictionary";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import { CloudinaryController } from "@/services/external/cloudinary/cloudinary.controller";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import type { Community } from "@/services/internal/community/entities/community.entity";

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

export default function EditCommunityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const communityId = searchParams.get("id");
  const PATHS = useLocalizedPaths();
  const dict = useDictionary();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Load community data
  useEffect(() => {
    if (!communityId) {
      router.push(PATHS.DASHBOARD.ADMINISTRATION.COMMUNITY.ROOT);
      return;
    }

    const loadCommunity = async () => {
      try {
        setLoading(true);
        const community =
          await CommunityController.getCommunityById(communityId);

        if (community) {
          form.setValue("name", community.name);
          form.setValue("description", community.description || "");
          form.setValue("imageUrl", community.imageUrl || "");
          setImageUrl(community.imageUrl);
        } else {
          alert("Community not found");
          router.push(PATHS.DASHBOARD.ADMINISTRATION.COMMUNITY.ROOT);
        }
      } catch (error) {
        console.error("Error loading community:", error);
        alert("Error loading community. Please try again.");
        router.push(PATHS.DASHBOARD.ADMINISTRATION.COMMUNITY.ROOT);
      } finally {
        setLoading(false);
      }
    };

    loadCommunity();
  }, [
    communityId,
    PATHS.DASHBOARD.ADMINISTRATION.COMMUNITY.ROOT,
    form.setValue,
    router.push,
  ]);

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
    if (!communityId) return;

    setSaving(true);
    try {
      const response = await CommunityController.updateCommunity(communityId, {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
      });

      if (response) {
        router.push(PATHS.DASHBOARD.ADMINISTRATION.COMMUNITY.ROOT);
      } else {
        alert("Error updating community. Please try again.");
      }
    } catch (error) {
      console.error("Error updating community:", error);
      alert("Error updating community. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(PATHS.DASHBOARD.ADMINISTRATION.COMMUNITY.ROOT);
  };

  const handleDelete = async () => {
    if (!communityId) return;

    setDeleting(true);
    try {
      await CommunityController.deleteCommunity(communityId);
      router.push(PATHS.DASHBOARD.ADMINISTRATION.COMMUNITY.ROOT);
    } catch (error) {
      console.error("Error deleting community:", error);
      alert("Error deleting community. Please try again.");
      setDeleting(false);
    }
  };

  // Create preview community object
  const previewCommunity: Community = {
    id: communityId || "",
    name: form.watch("name") || "Community Name",
    description: form.watch("description") || "Community description",
    imageUrl: imageUrl,
    ownerId: "",
    ownerProfileId: "",
    createdAt: new Date(),
    followerCount: 0,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <Spinner className="size-8 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading community...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Community</h1>
        <p className="text-muted-foreground mt-1">
          Update your community information and see a live preview
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="bg-card rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Community Information</h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    onClick={() => fileInputRef.current?.click()}
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
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm font-bold uppercase text-muted-foreground">
                        Community Name{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <span className="text-xs text-muted-foreground">
                        {field.value?.length || 0}/{COMMUNITY_LIMITS.NAME.MAX}
                      </span>
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={saving}
                        maxLength={COMMUNITY_LIMITS.NAME.MAX}
                        className="bg-background border-input"
                        placeholder="Enter community name"
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
                        Community Description{" "}
                        <span className="text-destructive">*</span>
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
                        maxLength={COMMUNITY_LIMITS.DESCRIPTION.MAX}
                        rows={4}
                        className="bg-background border-input resize-none"
                        placeholder="Describe your community"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Tell people what this community is about
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className="flex justify-between pt-4">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleCancel}
                    disabled={saving || deleting}
                  >
                    Cancel
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        variant="destructive"
                        disabled={saving || deleting}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {deleting ? "Deleting..." : "Delete Community"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the community and remove all associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          disabled={deleting}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {deleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <Button type="submit" disabled={saving || deleting}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Preview Section */}
        <div className="bg-card rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
          <div className="sticky top-6">
            <CommunityCard community={previewCommunity} />
            <p className="text-xs text-muted-foreground text-center mt-4">
              This is how your community card will appear to users
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
