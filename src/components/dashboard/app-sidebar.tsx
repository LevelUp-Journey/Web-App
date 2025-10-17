import { Code2, HelpCircle, Home, Settings, Users } from "lucide-react";
import Image from "next/image";
import { PATHS } from "@/lib/paths";
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
} from "../ui/sidebar";
import { NavUser } from "./nav-user";

// Menu items.
const topItems = [
    {
        title: "Dashboard",
        url: PATHS.DASHBOARD.ROOT,
        icon: Home,
    },
    {
        title: "Challenges",
        url: PATHS.DASHBOARD.CHALLENGES,
        icon: Code2,
    },
    {
        title: "Community",
        url: PATHS.DASHBOARD.COMMUNITY,
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

export default function AppSidebar() {
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
                            <NavUser
                                user={{
                                    avatar: "",
                                    name: "",
                                }}
                            />
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarFooter>
        </Sidebar>
    );
}
