"use client";

import {
    EllipsisVertical,
    LogOut,
    MoonIcon,
    SunIcon,
    UserCircle2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import type { ProfileResponse } from "@/services/internal/profiles/profiles/controller/profile.response";

export function NavUser({ profile }: { profile: ProfileResponse }) {
    const { isMobile } = useSidebar();
    const { setTheme } = useTheme();
    const router = useRouter();

    const displayName =
        `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
    const initials =
        `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase();

    const handleLogout = () => {
        // Implement logout logic here
        AuthController.signOut();
    };

    const handleAccountClick = () => {
        router.push("/dashboard/account");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                        src={profile.profileUrl || ""}
                        alt={displayName}
                    />
                    <AvatarFallback className="rounded-lg">
                        {initials}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage
                                src={profile.profileUrl || ""}
                                alt={displayName}
                            />
                            <AvatarFallback className="rounded-lg">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">
                                {displayName}
                            </span>
                            <span className="truncate text-xs text-muted-foreground">
                                @{profile.username}
                            </span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleAccountClick}>
                        <UserCircle2Icon />
                        Account
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.preventDefault();
                            setTheme((prev) =>
                                prev === "light" ? "dark" : "light",
                            );
                        }}
                    >
                        <SunIcon className="dark:hidden" />
                        <MoonIcon className="hidden dark:inline" />
                        Theme
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
