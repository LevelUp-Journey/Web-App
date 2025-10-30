"use client";

import { useRef } from "react";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CloudinaryController } from "@/services/external/cloudinary/cloudinary.controller";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string | undefined) => void;
    disabled?: boolean;
    label?: string;
}

export default function ImageUpload({
    value,
    onChange,
    disabled = false,
    label = "Image",
}: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // Convert file to base64
            const reader = new FileReader();
            reader.onload = async () => {
                const base64 = reader.result as string;

                try {
                    // Upload to Cloudinary
                    const imageUrl =
                        await CloudinaryController.uploadImage(base64);
                    onChange(imageUrl);
                } catch (error) {
                    console.error("Error uploading image:", error);
                    // TODO: Show error toast
                }
            };

            reader.readAsDataURL(file);
        } catch (error) {
            console.error("Error reading file:", error);
        }
    };

    return (
        <div>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={disabled}
            />
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full px-4 py-2"
            >
                <ImagePlus className="h-5 w-5 mr-2" />
                <span className="font-medium">{label}</span>
            </Button>
        </div>
    );
}
