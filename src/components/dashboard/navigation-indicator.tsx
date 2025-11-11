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
import { useDictionary } from "@/hooks/use-dictionary";

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
const getSegmentLabels = (dict: any): Record<string, string> => ({
    dashboard: dict?.navigationIndicator.dashboard || "Dashboard",
    profile: dict?.navigationIndicator.profile || "Profile",
    challenges: dict?.navigationIndicator.challenges || "Challenges",
    create: dict?.navigationIndicator.create || "Create",
    versions: dict?.navigationIndicator.versions || "Versions",
    tests: dict?.navigationIndicator.tests || "Tests",
    community: dict?.navigationIndicator.community || "Community",
    post: dict?.navigationIndicator.post || "Post",
    leaderboard: dict?.navigationIndicator.leaderboard || "Leaderboard",
    settings: dict?.navigationIndicator.settings || "Settings",
    help: dict?.navigationIndicator.help || "Help",
    admin: dict?.navigationIndicator.admin || "Administration",
    courses: dict?.navigationIndicator.courses || "Courses",
    guides: dict?.navigationIndicator.guides || "Guides",
    edit: dict?.navigationIndicator.edit || "Edit",
    auth: dict?.navigationIndicator.auth || "Auth",
    "sign-in": dict?.navigationIndicator.signIn || "Sign In",
    "sign-up": dict?.navigationIndicator.signUp || "Sign Up",
    legal: dict?.navigationIndicator.legal || "Legal",
    "privacy-policy":
        dict?.navigationIndicator.privacyPolicy || "Privacy Policy",
    terms: dict?.navigationIndicator.terms || "Terms of Service",
});

export function Breadcrumbs() {
    const pathname = usePathname();
    const dict = useDictionary();
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItemData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function generateBreadcrumbs() {
            if (!pathname) return;

            const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}\//, "/");
            const segments = pathWithoutLocale.split("/").filter(Boolean);
            const SEGMENT_LABELS = getSegmentLabels(dict);

            const items: BreadcrumbItemData[] = [
                {
                    label: dict?.navigationIndicator.home || "Home",
                    href: "/dashboard",
                },
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
                        label: `${dict?.navigationIndicator.create || "Create"} ${contextLabel.slice(0, -1)}`,
                        href: fullPath,
                    });
                } else if (segment === "edit") {
                    items.push({
                        label: dict?.navigationIndicator.edit || "Edit",
                        href: fullPath,
                    });
                } else if (segment === "versions") {
                    items.push({
                        label: dict?.navigationIndicator.versions || "Versions",
                        href: fullPath,
                    });
                } else if (segment === "tests") {
                    items.push({
                        label: dict?.navigationIndicator.tests || "Tests",
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
    const dict = useDictionary();

    if (!pathname) return null;

    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}\//, "/");
    const segments = pathWithoutLocale.split("/").filter(Boolean);
    const locale = pathname.match(/^\/([a-z]{2})\//)?.[1] || "en";
    const SEGMENT_LABELS = getSegmentLabels(dict);

    const breadcrumbs: BreadcrumbItemData[] = [
        {
            label: dict?.navigationIndicator.home || "Home",
            href: `/${locale}/dashboard`,
        },
    ];

    let currentPath = "";

    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        currentPath += `/${segment}`;
        const fullPath = `/${locale}${currentPath}`;

        // Ignorar IDs
        if (/^[a-f0-9-]{36}$/.test(segment) || /^\d+$/.test(segment)) {
            const prevSegment = segments[i - 1];
            const label =
                SEGMENT_LABELS[prevSegment]?.slice(0, -1) ||
                dict?.navigationIndicator.detail ||
                "Detail";
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
                label: `${dict?.navigationIndicator.create || "Create"} ${contextLabel.slice(0, -1)}`,
                href: fullPath,
            });
        } else if (segment === "edit") {
            breadcrumbs.push({
                label: dict?.navigationIndicator.edit || "Edit",
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
