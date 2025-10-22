"use client";

import { useRef, useState } from "react";
import { User, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CloudinaryController } from "@/services/external/cloudinary/cloudinary.controller";

interface ProfileImageUploadProps {
    value?: string;
    onChange: (url: string | undefined) => void;
    disabled?: boolean;
}

export default function ProfileImageUpload({
    value,
    onChange,
    disabled = false,
}: ProfileImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !file.type.startsWith('image/')) return;

        setIsUploading(true);

        try {
            const reader = new FileReader();
            reader.onload = async () => {
                const base64 = reader.result as string;
                try {
                    const imageUrl = await CloudinaryController.uploadImage(base64);
                    if (imageUrl) {
                        onChange(imageUrl);
                    } else {
                        console.warn("Image upload failed - no URL returned");
                    }
                } catch (error) {
                    console.error("Error uploading image:", error);
                    // Don't change the value if upload fails
                } finally {
                    setIsUploading(false);
                }
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error("Error reading file:", error);
            setIsUploading(false);
        }

        event.target.value = '';
    };

    const handleClick = () => {
        if (!disabled && !isUploading) {
            fileInputRef.current?.click();
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering the file input click
        onChange(undefined);
    };

    return (
        <div className="relative inline-block">
            <Avatar
                className="h-24 w-24 cursor-pointer ring-2 ring-muted hover:ring-primary transition-colors"
                onClick={handleClick}
            >
                <AvatarImage src={value} alt="Profile" />
                <AvatarFallback className="bg-muted">
                    <User className="h-8 w-8 text-muted-foreground" />
                </AvatarFallback>
            </Avatar>

            {/* Remove button - only show when there's an image */}
            {value && !isUploading && (
                <button
                    type="button"
                    className="absolute -top-1 -right-1 h-6 w-6 bg-destructive rounded-full flex items-center justify-center cursor-pointer hover:bg-destructive/90 transition-colors shadow-md"
                    onClick={handleRemove}
                    disabled={disabled}
                    title="Remove photo"
                >
                    <X className="h-3 w-3 text-destructive-foreground" />
                </button>
            )}

            {isUploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={disabled || isUploading}
            />
        </div>
    );
}