import {
    Code2,
    HelpCircle,
    Home,
    Settings,
    ShieldUser,
    Trophy,
    Users,
} from "lucide-react";
import Image from "next/image";
import { NavUser } from "@/components/dashboard/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserRole } from "@/lib/consts";
import { PATHS } from "@/lib/paths";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";

// Menu items.
const topItems = [
    {
        title: "Dashboard",
        url: PATHS.DASHBOARD.ROOT,
        icon: Home,
    },
    {
        title: "Challenges",
        url: PATHS.DASHBOARD.CHALLENGES.ROOT,
        icon: Code2,
    },
    {
        title: "Community",
        url: PATHS.DASHBOARD.COMMUNITY.ROOT,
        icon: Users,
    },
    {
        title: "Leaderboard",
        url: PATHS.DASHBOARD.LEADERBOARD,
        icon: Trophy,
    },
];

const administrativeItems = [
    {
        title: "Admin Dashboard",
        url: PATHS.DASHBOARD.ADMINISTRATION.ROOT,
        icon: ShieldUser,
    },
    {
        title: "Community Management",
        url: PATHS.DASHBOARD.ADMINISTRATION.COMMUNITY.ROOT,
        icon: Users,
    },
];

const bottomItems = [
    {
        title: "Settings",
        url: PATHS.DASHBOARD.SETTINGS,
        icon: Settings,
    },
    {
        title: "Help",
        url: PATHS.DASHBOARD.HELP,
        icon: HelpCircle,
    },
];

export default async function AppSidebar() {
    const [roles, profile] = await Promise.all([
        AuthController.getUserRoles(),
        ProfileController.getCurrentUserProfile(),
    ]);

    const isTeacher =
        roles.includes(UserRole.TEACHER) || roles.includes(UserRole.ADMIN);

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex items-center gap-2">
                            <Image
                                src="/pet_smile.png"
                                width={36}
                                height={36}
                                alt="Level Up Journey Pet Smiling"
                                className="rounded-md"
                            />
                            <span className="font-semibold text-lg tracking-tight">
                                Level Up Journey
                            </span>
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Home</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {topItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                {isTeacher && (
                    <SidebarGroup>
                        <SidebarGroupLabel>Administrative</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {administrativeItems.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <a href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {bottomItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            <NavUser profile={profile} />
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarFooter>
        </Sidebar>
    );
}
