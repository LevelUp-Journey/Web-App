"use client";

import { ImageIcon } from "lucide-react";
import { useCallback, useState } from "react";
import type { DropEvent, FileRejection } from "react-dropzone";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { CloudinaryController } from "@/services/external/cloudinary/cloudinary.controller";

interface CoverDropzoneProps {
    onImageUrlChange: (url: string) => void;
    currentImage?: string | null;
    disabled?: boolean;
    className?: string;
    aspectRatio?: "video" | "wide" | "ultrawide"; // 16:9, 21:9, 32:9
}

export function CoverDropzone({
    onImageUrlChange,
    currentImage,
    disabled = false,
    className,
    aspectRatio = "wide",
}: CoverDropzoneProps) {
    const [isDragActive, setIsDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(
        currentImage || null,
    );

    const uploadImageToCloudinary = useCallback(
        async (file: File) => {
            setIsUploading(true);
            try {
                // Upload directly to Cloudinary using signed upload
                const uploadedUrl = await CloudinaryController.uploadImage(
                    file,
                    "cover-images",
                );

                setImageUrl(uploadedUrl);
                onImageUrlChange(uploadedUrl);
                toast.success("Cover image uploaded successfully!");
            } catch (error) {
                console.error("Cloudinary upload error:", error);
                toast.error("Failed to upload image. Please try again.");
            } finally {
                setIsUploading(false);
            }
        },
        [onImageUrlChange],
    );

    const onDrop = useCallback(
        async (
            acceptedFiles: File[],
            fileRejections: FileRejection[],
            _event: DropEvent,
        ) => {
            if (fileRejections.length > 0) {
                const message = fileRejections.at(0)?.errors.at(0)?.message;
                toast.error(message || "File rejected");
                setIsDragActive(false);
                return;
            }

            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0];
                await uploadImageToCloudinary(file);
            }
            setIsDragActive(false);
        },
        [uploadImageToCloudinary],
    );

    const {
        getRootProps,
        getInputProps,
        isDragActive: isDropzoneActive,
    } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        maxFiles: 1,
        maxSize: 1024 * 1024 * 10, // 10MB
        disabled: disabled || isUploading,
        onDragEnter: () => setIsDragActive(true),
        onDragLeave: () => setIsDragActive(false),
    });

    // Aspect ratio classes
    const aspectRatioClasses = {
        video: "aspect-video", // 16:9
        wide: "aspect-[21/9]", // 21:9
        ultrawide: "aspect-[32/9]", // 32:9
    };

    return (
        <div className={cn("flex flex-col gap-4", className)}>
            <div
                {...getRootProps()}
                className={cn(
                    "relative w-full rounded-lg overflow-hidden cursor-pointer transition-all",
                    aspectRatioClasses[aspectRatio],
                    "border-2 border-dashed border-muted-foreground/30 hover:border-primary",
                    isDropzoneActive || isDragActive
                        ? "ring-2 ring-primary border-primary"
                        : "",
                    (disabled || isUploading) &&
                        "opacity-50 cursor-not-allowed",
                )}
            >
                <input
                    {...getInputProps()}
                    disabled={disabled || isUploading}
                />

                {/* Image or placeholder */}
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                        {isUploading ? (
                            <div className="flex flex-col items-center gap-3">
                                <Spinner className="h-8 w-8" />
                                <p className="text-sm text-muted-foreground">
                                    Uploading...
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <ImageIcon
                                    size={48}
                                    className="text-muted-foreground"
                                />
                                <div className="text-center">
                                    <p className="text-sm font-medium text-foreground">
                                        Click or drag to upload cover
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Maximum file size: 10MB
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Hover overlay */}
                {!isUploading && imageUrl && (
                    <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity bg-black/50 flex items-center justify-center">
                        <div className="text-center">
                            <ImageIcon
                                size={32}
                                className="text-white mx-auto mb-2"
                            />
                            <p className="text-sm font-medium text-white">
                                Click or drag to change
                            </p>
                            <p className="text-xs text-white/80">
                                Maximum file size: 10MB
                            </p>
                        </div>
                    </div>
                )}

                {/* Drag overlay */}
                {(isDropzoneActive || isDragActive) && !isUploading && (
                    <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center">
                            <ImageIcon
                                size={48}
                                className="text-primary mx-auto mb-2"
                            />
                            <p className="text-base font-medium text-primary">
                                Drop your cover image here
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {!imageUrl && (
                <p className="text-xs text-center text-muted-foreground">
                    Recommended size: 1920x1080 or higher for best quality
                </p>
            )}
        </div>
    );
}
