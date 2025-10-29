"use client";
import { usePathname } from "next/navigation";

export function NavigationIndicator() {
    const pathname = usePathname();
    return <div>{pathname}</div>;
}
