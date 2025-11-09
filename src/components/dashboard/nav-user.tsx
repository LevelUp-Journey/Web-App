"use client";

import { LogOut, UserCircle2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { LanguageToggle } from "@/components/ui/language-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import type { ProfileResponse } from "@/services/internal/profiles/profiles/controller/profile.response";

export function NavUser({ profile }: { profile: ProfileResponse }) {
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
                side={"bottom"}
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
                    <div className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-sm">Theme</span>
                        <ThemeToggle />
                    </div>
                    <div className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-sm">Language</span>
                        <LanguageToggle />
                    </div>
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
