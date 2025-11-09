"use client";

import {
    Globe,
    LogOut,
    MoonIcon,
    SunIcon,
    UserCircle2Icon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDictionary } from "@/hooks/use-dictionary";
import { useLocale } from "@/hooks/use-locale";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import type { ProfileResponse } from "@/services/internal/profiles/profiles/controller/profile.response";

export function NavUser({ profile }: { profile: ProfileResponse }) {
    const { setTheme } = useTheme();
    const router = useRouter();
    const pathname = usePathname();
    const currentLocale = useLocale();
    const dict = useDictionary();

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

    const handleLanguageChange = (newLocale: string) => {
        if (!pathname) return;

        // Remove the current locale from the pathname
        const pathWithoutLocale = pathname.replace(`/${currentLocale}`, "");

        // Construct the new path with the new locale
        const newPath = `/${newLocale}${pathWithoutLocale || "/"}`;

        // Navigate to the new path
        router.push(newPath);
    };

    const languages = {
        en: { name: "English", flag: "🇺🇸" },
        es: { name: "Español", flag: "🇪🇸" },
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
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <Globe />
                            {dict?.navigation.language || "Language"}
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            {Object.entries(languages).map(
                                ([locale, { name, flag }]) => (
                                    <DropdownMenuItem
                                        key={locale}
                                        onClick={() =>
                                            handleLanguageChange(locale)
                                        }
                                        className={
                                            currentLocale === locale
                                                ? "bg-accent font-medium"
                                                : ""
                                        }
                                    >
                                        <span className="mr-2">{flag}</span>
                                        {name}
                                    </DropdownMenuItem>
                                ),
                            )}
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
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
