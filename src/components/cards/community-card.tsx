"use client";

import { useEffect, useRef, useState } from "react";
import type { Community } from "@/services/internal/community/entities/community.entity";

interface CommunityCardProps {
    community: Community;
    onClick?: () => void;
}

export default function CommunityCard({
    community,
    onClick,
}: CommunityCardProps) {
    const [bannerColor, setBannerColor] = useState<string>("#6b7280");
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (community.imageUrl) {
            extractDominantColor(community.imageUrl);
        }
    }, [community.imageUrl]);

    const extractDominantColor = (imageUrl: string) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageUrl;

        img.onload = () => {
            try {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                if (!ctx) return;

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height,
                );
                const data = imageData.data;

                let r = 0,
                    g = 0,
                    b = 0;
                let count = 0;

                // Sample pixels (every 10th pixel for performance)
                for (let i = 0; i < data.length; i += 40) {
                    r += data[i];
                    g += data[i + 1];
                    b += data[i + 2];
                    count++;
                }

                r = Math.floor(r / count);
                g = Math.floor(g / count);
                b = Math.floor(b / count);

                // Darken the color a bit for better contrast
                r = Math.floor(r * 0.7);
                g = Math.floor(g * 0.7);
                b = Math.floor(b * 0.7);

                setBannerColor(`rgb(${r}, ${g}, ${b})`);
            } catch (error) {
                console.error("Error extracting color:", error);
                // Keep default color
            }
        };

        img.onerror = () => {
            // Keep default color on error
        };
    };

    return (
        <div
            className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={onClick}
        >
            {/* Banner Section - No padding, fills entire width */}
            <div
                className="h-32 w-full relative"
                style={{ backgroundColor: bannerColor }}
            >
                {/* Avatar positioned at the bottom of banner */}
                <div className="absolute -bottom-8 left-4">
                    <div className="w-16 h-16 rounded-full border-4 border-card bg-muted overflow-hidden">
                        {community.imageUrl ? (
                            <img
                                ref={imgRef}
                                src={community.imageUrl}
                                alt={community.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-xl font-bold">
                                {community.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section with padding */}
            <div className="pt-10 pb-3 px-6">
                <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                    {community.name}
                </h3>
            </div>

            <div className="px-6 pb-6">
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {community.description}
                </p>

                <div className="mt-4 text-xs text-muted-foreground">
                    <span>
                        Created {new Date(community.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>
    );
}
