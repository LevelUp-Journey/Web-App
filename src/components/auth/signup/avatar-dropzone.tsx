"use client";

import { UserCircle2 } from "lucide-react";
import { useCallback, useState } from "react";
import type { DropEvent, FileRejection } from "react-dropzone";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { CloudinaryController } from "@/services/external/cloudinary/cloudinary.controller";

interface AvatarDropzoneProps {
    onImageUrlChange: (url: string) => void;
    currentImage?: string | null;
    disabled?: boolean;
    className?: string;
}

export function AvatarDropzone({
    onImageUrlChange,
    currentImage,
    disabled = false,
    className,
}: AvatarDropzoneProps) {
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
                    "profile-images",
                );

                setImageUrl(uploadedUrl);
                onImageUrlChange(uploadedUrl);
                toast.success("Image uploaded successfully!");
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
        maxSize: 1024 * 1024 * 10,
        disabled: disabled || isUploading,
        onDragEnter: () => setIsDragActive(true),
        onDragLeave: () => setIsDragActive(false),
    });

    return (
        <div className={cn("flex flex-col items-center gap-4", className)}>
            <div
                {...getRootProps()}
                className={cn(
                    "flex justify-center items-center relative h-32 w-32 rounded-full overflow-hidden cursor-pointer transition-all",
                    "border-4 border-dashed border-muted-foreground/30 hover:border-primary",
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

                <Avatar className="w-full h-full">
                    {imageUrl ? (
                        <AvatarImage
                            src={imageUrl}
                            alt="Profile avatar"
                            className="object-cover"
                        />
                    ) : (
                        <AvatarFallback>
                            {isUploading ? (
                                <Spinner className="h-6 w-6" />
                            ) : (
                                <UserCircle2
                                    size={64}
                                    className="text-muted-foreground"
                                />
                            )}
                        </AvatarFallback>
                    )}
                </Avatar>

                {/* Hover overlay */}
                {!isUploading && (
                    <div className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity bg-black/40 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <p className="text-xs font-medium text-white">
                                Click or drag
                            </p>
                            <p className="text-xs text-white/80">to upload</p>
                        </div>
                    </div>
                )}

                {/* Drag overlay */}
                {(isDropzoneActive || isDragActive) && !isUploading && (
                    <div className="absolute inset-0 bg-primary/10 rounded-full flex items-center justify-center">
                        <p className="text-xs font-medium text-primary">
                            Drop image
                        </p>
                    </div>
                )}
            </div>

            <p className="text-xs text-center text-muted-foreground max-w-xs">
                Click or drag and drop your avatar here (max 10MB)
            </p>
        </div>
    );
}
