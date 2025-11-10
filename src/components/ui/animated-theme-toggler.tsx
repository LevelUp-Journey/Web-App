"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AnimatedThemeTogglerProps {
    duration?: number;
    className?: string;
    variant?:
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost"
        | "link";
    size?: "default" | "sm" | "lg" | "icon";
}

export const AnimatedThemeToggler = ({
    className,
    duration = 400,
    variant = "ghost",
    size = "icon",
}: AnimatedThemeTogglerProps) => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = useCallback(async () => {
        if (!buttonRef.current || !mounted) return;

        const newTheme = theme === "dark" ? "light" : "dark";

        // Check if browser supports startViewTransition
        if (!document.startViewTransition) {
            setTheme(newTheme);
            return;
        }

        await document.startViewTransition(() => {
            flushSync(() => {
                setTheme(newTheme);
            });
        }).ready;

        const { top, left, width, height } =
            buttonRef.current.getBoundingClientRect();
        const x = left + width / 2;
        const y = top + height / 2;
        const maxRadius = Math.hypot(
            Math.max(left, window.innerWidth - left),
            Math.max(top, window.innerHeight - top),
        );

        document.documentElement.animate(
            {
                clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${maxRadius}px at ${x}px ${y}px)`,
                ],
            },
            {
                duration,
                easing: "ease-in-out",
                pseudoElement: "::view-transition-new(root)",
            },
        );
    }, [theme, setTheme, mounted, duration]);

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <Button
                variant={variant}
                size={size}
                className={cn("opacity-0", className)}
            >
                <Sun className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Toggle theme</span>
            </Button>
        );
    }

    return (
        <Button
            ref={buttonRef}
            onClick={toggleTheme}
            variant={variant}
            size={size}
            className={cn(className)}
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
};
