"use client";

import { Camera, X } from "lucide-react";
import Image from "next/image";
import { forwardRef, useRef } from "react";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    onFileSelect: (file: File) => void;
    onRemove: () => void;
    isUploading: boolean;
    disabled?: boolean;
    label?: string;
    placeholder?: string;
    recommendedSize?: string;
    variant?: "icon" | "banner";
}

export const ImageUpload = forwardRef<HTMLInputElement, ImageUploadProps>(
    (
        {
            value,
            onChange,
            onFileSelect,
            onRemove,
            isUploading,
            disabled = false,
            label,
            placeholder = "Upload image",
            recommendedSize,
            variant = "icon",
        },
        ref,
    ) => {
        const internalRef = useRef<HTMLInputElement>(null);
        const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;

        const handleClick = () => {
            inputRef.current?.click();
        };

        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                onFileSelect(file);
            }
        };

        const containerClasses = variant === "banner"
            ? "relative w-full h-32 rounded-lg border-2 border-dashed border-muted-foreground/50 hover:border-primary transition-colors flex items-center justify-center overflow-hidden bg-muted/30"
            : "relative w-24 h-24 rounded-full border-2 border-dashed border-muted-foreground/50 hover:border-primary transition-colors flex items-center justify-center overflow-hidden bg-muted/30";

        const content = value ? (
            <Image
                src={value}
                alt={label || "Uploaded image"}
                fill
                sizes={variant === "banner" ? "100vw" : "96px"}
                className="object-cover"
            />
        ) : (
            <div className="text-center">
                <Camera className={`mx-auto text-muted-foreground ${variant === "banner" ? "w-6 h-6" : "w-8 h-8"}`} />
                <span className={`text-muted-foreground mt-1 block ${variant === "banner" ? "text-xs" : "text-xs"}`}>
                    {placeholder}
                </span>
            </div>
        );

        return (
            <div className="space-y-2">
                {(label || recommendedSize) && (
                    <div className="flex items-center justify-between">
                        {label && (
                            <span className="text-sm font-bold uppercase text-muted-foreground">
                                {label}
                            </span>
                        )}
                        {recommendedSize && (
                            <span className="text-xs text-muted-foreground">
                                {recommendedSize}
                            </span>
                        )}
                    </div>
                )}
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={isUploading || disabled}
                    />
                    <button
                        type="button"
                        onClick={handleClick}
                        disabled={isUploading || disabled}
                        className={containerClasses}
                    >
                        {content}
                    </button>

                    {value && !isUploading && (
                        <button
                            type="button"
                            onClick={onRemove}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}

                    {isUploading && (
                        <div className={`absolute inset-0 flex items-center justify-center ${variant === "banner" ? "bg-background/80 rounded-lg" : "bg-background/80 rounded-full"}`}>
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        </div>
                    )}
                </div>
            </div>
        );
    },
);

ImageUpload.displayName = "ImageUpload";