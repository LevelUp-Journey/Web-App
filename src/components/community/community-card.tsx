"use client";

import NextImage from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDictionary } from "@/hooks/use-dictionary";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import type { Community } from "@/services/internal/community/entities/community.entity";

interface CommunityCardProps {
    community: Community;
}

export default function CommunityCard({ community }: CommunityCardProps) {
    const [bannerColor, setBannerColor] = useState<string>("#6b7280");
    const PATHS = useLocalizedPaths();
    const dict = useDictionary();
    const followerCount = community.followerCount ?? 0;
    const followerLabel =
        dict?.communityCard?.followers ||
        dict?.admin?.community?.followers ||
        "Followers";
    const formattedFollowerCount = useMemo(
        () => new Intl.NumberFormat().format(followerCount),
        [followerCount],
    );

    const extractDominantColor = useCallback((imageUrl: string) => {
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
    }, []);

    useEffect(() => {
        if (community.imageUrl) {
            extractDominantColor(community.imageUrl);
        }
    }, [community.imageUrl, extractDominantColor]);

    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-lg transition-shadow group">
            {/* Banner Section - No padding, fills entire width */}
            <div
                className="h-32 w-full relative"
                style={{ backgroundColor: bannerColor }}
            >
                {/* Avatar positioned at the bottom of banner */}
                <div className="absolute -bottom-8 left-4">
                    <div className="w-16 h-16 rounded-full border-4 border-card bg-muted overflow-hidden relative">
                        {community.imageUrl ? (
                            <NextImage
                                src={community.imageUrl}
                                alt={community.name}
                                fill
                                sizes="64px"
                                className="object-cover"
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
                <h3 className="text-lg font-bold">
                    {community.id ? (
                        <Link
                            href={PATHS.DASHBOARD.COMMUNITY.WITH_ID(
                                community.id,
                            )}
                            className="text-foreground hover:text-primary transition-colors"
                        >
                            {community.name}
                        </Link>
                    ) : (
                        community.name
                    )}
                </h3>
            </div>

            <div className="px-6 pb-6">
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {community.description}
                </p>

                <div className="mt-4 text-xs text-muted-foreground flex items-center justify-between gap-4">
                    <span className="truncate">
                        Created{" "}
                        {new Date(community.createdAt).toLocaleDateString()}
                    </span>
                    <span className="font-medium text-foreground">
                        {formattedFollowerCount} {followerLabel}
                    </span>
                </div>
            </div>
        </div>
    );
}
