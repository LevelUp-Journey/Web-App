"use client";

import { Globe } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale } from "@/hooks/use-locale";

const languages = {
    en: { name: "English", flag: "🇺🇸" },
    es: { name: "Español", flag: "🇪🇸" },
};

export function LanguageToggle() {
    const pathname = usePathname();
    const router = useRouter();
    const currentLocale = useLocale();

    const handleLanguageChange = (newLocale: string) => {
        if (!pathname) return;

        // Remove the current locale from the pathname
        const pathWithoutLocale = pathname.replace(`/${currentLocale}`, "");

        // Construct the new path with the new locale
        const newPath = `/${newLocale}${pathWithoutLocale || "/"}`;

        // Navigate to the new path
        router.push(newPath);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Globe className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Toggle language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {Object.entries(languages).map(([locale, { name, flag }]) => (
                    <DropdownMenuItem
                        key={locale}
                        onClick={() => handleLanguageChange(locale)}
                        className={
                            currentLocale === locale
                                ? "bg-accent font-medium"
                                : ""
                        }
                    >
                        <span className="mr-2">{flag}</span>
                        {name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
