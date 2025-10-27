import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { getLocalizedPaths } from "@/lib/paths";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";

export default async function AdminLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const PATHS = getLocalizedPaths(lang);

    const userId = await AuthController.getUserId();
    const profile = await ProfileController.getProfileByUserId(userId);

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
    ];

    return (
        <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
            <div className="space-y-2">
                <h1 className="text-2xl font-semibold">
                    Welcome, {profile.username}
                </h1>
            </div>

            <Separator />

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

            <div className="mt-6">{children}</div>
        </div>
    );
}
