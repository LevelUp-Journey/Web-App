import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { getLocalizedPaths } from "@/lib/paths";

export default async function AdminLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const PATHS = getLocalizedPaths(lang);

    const navLinks = [
        { label: "General", href: PATHS.DASHBOARD.ADMINISTRATION.ROOT },
        {
            label: "Challenges",
            href: PATHS.DASHBOARD.ADMINISTRATION.CHALLENGES.ROOT,
        },
        { label: "Courses", href: PATHS.DASHBOARD.ADMINISTRATION.COURSES.ROOT },
        {
            label: "Guides",
            href: PATHS.DASHBOARD.ADMINISTRATION.GUIDES.ROOT,
        },
        {
            label: "Communities",
            href: PATHS.DASHBOARD.ADMINISTRATION.COMMUNITY.ROOT,
        },
    ];

    return (
        <div className="w-full p-4 space-y-4">
            <NavigationMenu>
                <NavigationMenuList>
                    {navLinks.map((link) => (
                        <NavigationMenuItem key={link.label}>
                            <NavigationMenuLink asChild>
                                <Link href={link.href}>{link.label}</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>

            <Separator />

            <div className="mt-6 w-full max-w-6xl mx-auto">{children}</div>
        </div>
    );
}
