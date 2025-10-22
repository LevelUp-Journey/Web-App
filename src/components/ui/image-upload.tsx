"use client";

import { useState } from "react";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CloudinaryController } from "@/services/external/cloudinary/cloudinary.controller";
import {
    Dropzone,
    DropzoneContent,
    DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string | undefined) => void;
    disabled?: boolean;
}

export default function ImageUpload({
    value,
    onChange,
    disabled = false,
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);

    const handleFileSelect = async (files: File[]) => {
        if (files.length === 0) return;

        const file = files[0];
        if (!file) return;

        setIsUploading(true);

        try {
            // Convert file to base64
            const reader = new FileReader();
            reader.onload = async () => {
                const base64 = reader.result as string;

                try {
                    // Upload to Cloudinary
                    const imageUrl = await CloudinaryController.uploadImage(base64);
                    setPreviewUrl(imageUrl);
                    onChange(imageUrl);
                } catch (error) {
                    console.error("Error uploading image:", error);
                    // TODO: Show error toast
                } finally {
                    setIsUploading(false);
                }
            };

            reader.readAsDataURL(file);
        } catch (error) {
            console.error("Error reading file:", error);
            setIsUploading(false);
        }
    };

    const handleRemove = () => {
        setPreviewUrl(null);
        onChange(undefined);
    };

    if (previewUrl) {
        return (
            <div className="space-y-2">
                <Label>Post Image</Label>
                <div className="relative">
                    <img
                        src={previewUrl}
                        alt="Post preview"
                        className="w-full h-48 object-cover rounded-lg border"
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={handleRemove}
                        disabled={disabled || isUploading}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                    Click the X to remove the image
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <Label>Upload Image</Label>
            <Dropzone
                accept={{
                    "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
                }}
                maxSize={5 * 1024 * 1024} // 5MB
                maxFiles={1}
                onDrop={handleFileSelect}
                disabled={disabled || isUploading}
                className="w-full"
            >
                <DropzoneEmptyState>
                    <div className="flex flex-col items-center justify-center py-8">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">
                            {isUploading ? "Uploading..." : "Click to upload image"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            PNG, JPG, JPEG, GIF, WebP up to 5MB
                        </p>
                    </div>
                </DropzoneEmptyState>
                <DropzoneContent />
            </Dropzone>
        </div>
    );
}