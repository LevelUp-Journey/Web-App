"use client";

import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItemData {
    label: string;
    href?: string;
}

// Función para hacer fetch de nombres dinámicos
async function fetchResourceName(
    type: "challenge" | "guide" | "course" | "post",
    id: string,
): Promise<string> {
    try {
        const endpoints = {
            challenge: `/api/challenges/${id}`,
            guide: `/api/guides/${id}`,
            course: `/api/courses/${id}`,
            post: `/api/posts/${id}`,
        };

        const response = await fetch(endpoints[type]);
        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();
        return data.title || data.name || "Unknown";
    } catch (error) {
        console.error(`Error fetching ${type} name:`, error);
        return "Unknown";
    }
}

// Mapeo de segmentos a nombres amigables
const SEGMENT_LABELS: Record<string, string> = {
    dashboard: "Dashboard",
    profile: "Profile",
    challenges: "Challenges",
    create: "Create",
    versions: "Versions",
    tests: "Tests",
    community: "Community",
    post: "Post",
    leaderboard: "Leaderboard",
    settings: "Settings",
    help: "Help",
    admin: "Administration",
    courses: "Courses",
    guides: "Guides",
    edit: "Edit",
    auth: "Auth",
    "sign-in": "Sign In",
    "sign-up": "Sign Up",
    legal: "Legal",
    "privacy-policy": "Privacy Policy",
    terms: "Terms of Service",
};

export function Breadcrumbs() {
    const pathname = usePathname();
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItemData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function generateBreadcrumbs() {
            if (!pathname) return;

            const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}\//, "/");
            const segments = pathWithoutLocale.split("/").filter(Boolean);

            const items: BreadcrumbItemData[] = [
                { label: "Home", href: "/dashboard" },
            ];

            let currentPath = "";
            const locale = pathname.match(/^\/([a-z]{2})\//)?.[1] || "en";

            for (let i = 0; i < segments.length; i++) {
                const segment = segments[i];
                currentPath += `/${segment}`;
                const fullPath = `/${locale}${currentPath}`;

                // Ignorar segmentos que son IDs puros (UUID, números, etc.)
                if (/^[a-f0-9-]{36}$/.test(segment) || /^\d+$/.test(segment)) {
                    const prevSegment = segments[i - 1];
                    let resourceType:
                        | "challenge"
                        | "guide"
                        | "course"
                        | "post"
                        | null = null;

                    if (prevSegment === "challenges")
                        resourceType = "challenge";
                    else if (prevSegment === "guides") resourceType = "guide";
                    else if (prevSegment === "courses") resourceType = "course";
                    else if (prevSegment === "post") resourceType = "post";

                    if (resourceType) {
                        const name = await fetchResourceName(
                            resourceType,
                            segment,
                        );
                        items.push({
                            label: name,
                            href: fullPath,
                        });
                    }
                    continue;
                }

                // Manejar casos especiales
                if (segment === "create") {
                    const context = segments[i - 1];
                    const contextLabel =
                        SEGMENT_LABELS[context] || context || "Item";
                    items.push({
                        label: `Create ${contextLabel.slice(0, -1)}`,
                        href: fullPath,
                    });
                } else if (segment === "edit") {
                    items.push({
                        label: "Edit",
                        href: fullPath,
                    });
                } else if (segment === "versions") {
                    items.push({
                        label: "Versions",
                        href: fullPath,
                    });
                } else if (segment === "tests") {
                    items.push({
                        label: "Tests",
                        href: fullPath,
                    });
                } else {
                    const label =
                        SEGMENT_LABELS[segment] ||
                        segment.charAt(0).toUpperCase() + segment.slice(1);
                    items.push({
                        label,
                        href: fullPath,
                    });
                }
            }

            setBreadcrumbs(items);
            setLoading(false);
        }

        generateBreadcrumbs();
    }, [pathname]);

    if (loading || breadcrumbs.length <= 1) {
        return null;
    }

    return (
        <Breadcrumb className="py-3 px-4">
            <BreadcrumbList>
                {breadcrumbs.map((item, index) => {
                    const isLast = index === breadcrumbs.length - 1;

                    return (
                        <div key={index} className="contents">
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>
                                        {index === 0 ? (
                                            <Home className="w-4 h-4" />
                                        ) : (
                                            item.label
                                        )}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={item.href || "#"}>
                                            {index === 0 ? (
                                                <Home className="w-4 h-4" />
                                            ) : (
                                                item.label
                                            )}
                                        </Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {!isLast && <BreadcrumbSeparator />}
                        </div>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}

// Versión simplificada sin fetching (más rápida)
export function NavigationIndicator() {
    const pathname = usePathname();

    if (!pathname) return null;

    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}\//, "/");
    const segments = pathWithoutLocale.split("/").filter(Boolean);
    const locale = pathname.match(/^\/([a-z]{2})\//)?.[1] || "en";

    const breadcrumbs: BreadcrumbItemData[] = [
        { label: "Home", href: `/${locale}/dashboard` },
    ];

    let currentPath = "";

    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        currentPath += `/${segment}`;
        const fullPath = `/${locale}${currentPath}`;

        // Ignorar IDs
        if (/^[a-f0-9-]{36}$/.test(segment) || /^\d+$/.test(segment)) {
            const prevSegment = segments[i - 1];
            const label = SEGMENT_LABELS[prevSegment]?.slice(0, -1) || "Detail";
            breadcrumbs.push({
                label,
                href: fullPath,
            });
            continue;
        }

        // Manejar casos especiales
        if (segment === "create") {
            const context = segments[i - 1];
            const contextLabel = SEGMENT_LABELS[context] || context || "Item";
            breadcrumbs.push({
                label: `Create ${contextLabel.slice(0, -1)}`,
                href: fullPath,
            });
        } else if (segment === "edit") {
            breadcrumbs.push({
                label: "Edit",
                href: fullPath,
            });
        } else {
            const label =
                SEGMENT_LABELS[segment] ||
                segment.charAt(0).toUpperCase() + segment.slice(1);
            breadcrumbs.push({
                label,
                href: fullPath,
            });
        }
    }

    if (breadcrumbs.length <= 1) return null;

    return (
        <div>
            <Breadcrumb className="py-3 px-4 bg-background">
                <BreadcrumbList>
                    {breadcrumbs.map((item, index) => {
                        const isLast = index === breadcrumbs.length - 1;

                        return (
                            <div key={index} className="contents">
                                <BreadcrumbItem>
                                    {isLast ? (
                                        <BreadcrumbPage>
                                            {index === 0 ? (
                                                <Home className="w-4 h-4" />
                                            ) : (
                                                item.label
                                            )}
                                        </BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink asChild>
                                            <Link href={item.href || "#"}>
                                                {index === 0 ? (
                                                    <Home className="w-4 h-4" />
                                                ) : (
                                                    item.label
                                                )}
                                            </Link>
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                                {!isLast && <BreadcrumbSeparator />}
                            </div>
                        );
                    })}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
}
