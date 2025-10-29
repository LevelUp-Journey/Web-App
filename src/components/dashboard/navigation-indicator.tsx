"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

// Función para hacer fetch de nombres dinámicos
async function fetchResourceName(
    type: "challenge" | "guide" | "course" | "post",
    id: string,
): Promise<string> {
    try {
        // Aquí debes reemplazar con tus endpoints reales
        const endpoints = {
            challenge: `/api/challenges/${id}`,
            guide: `/api/guides/${id}`,
            course: `/api/courses/${id}`,
            post: `/api/posts/${id}`,
        };

        const response = await fetch(endpoints[type]);
        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();
        // Ajusta según la estructura de tu respuesta
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

// Patrones para identificar recursos dinámicos
const DYNAMIC_PATTERNS = {
    challenge: /\/challenges\/([a-zA-Z0-9-]+)(?:\/|$)/,
    guide: /\/guides\/([a-zA-Z0-9-]+)(?:\/|$)/,
    course: /\/courses\/([a-zA-Z0-9-]+)(?:\/|$)/,
    post: /\/post\/([a-zA-Z0-9-]+)(?:\/|$)/,
};

export function Breadcrumbs() {
    const pathname = usePathname();
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function generateBreadcrumbs() {
            if (!pathname) return;

            // Remover locale del path (ej: /en, /es)
            const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}\//, "/");
            const segments = pathWithoutLocale.split("/").filter(Boolean);

            const items: BreadcrumbItem[] = [
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
                    // Intentar obtener el nombre del recurso
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
                    // Usar etiqueta del mapeo o capitalizar
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
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground py-3 px-4">
            {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;

                return (
                    <div key={index} className="flex items-center space-x-2">
                        {index === 0 ? (
                            <Link
                                href={item.href || "#"}
                                className="hover:text-foreground transition-colors flex items-center"
                            >
                                <Home className="w-4 h-4" />
                            </Link>
                        ) : (
                            <>
                                <ChevronRight className="w-4 h-4" />
                                {isLast ? (
                                    <span className="font-medium text-foreground">
                                        {item.label}
                                    </span>
                                ) : (
                                    <Link
                                        href={item.href || "#"}
                                        className="hover:text-foreground transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}

// Versión simplificada sin fetching (más rápida)
export function NavigationIndicator() {
    const pathname = usePathname();

    if (!pathname) return null;

    // Remover locale del path
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}\//, "/");
    const segments = pathWithoutLocale.split("/").filter(Boolean);
    const locale = pathname.match(/^\/([a-z]{2})\//)?.[1] || "en";

    const breadcrumbs: BreadcrumbItem[] = [
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
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground py-3 px-4 bg-background">
            {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;

                return (
                    <div key={index} className="flex items-center space-x-2">
                        {index === 0 ? (
                            <Link
                                href={item.href || "#"}
                                className="hover:text-foreground transition-colors flex items-center"
                            >
                                <Home className="w-4 h-4" />
                            </Link>
                        ) : (
                            <>
                                <ChevronRight className="w-4 h-4" />
                                {isLast ? (
                                    <span className="font-medium text-foreground">
                                        {item.label}
                                    </span>
                                ) : (
                                    <Link
                                        href={item.href || "#"}
                                        className="hover:text-foreground transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
