import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function saveUserIdToLocalStorage(id: string) {
    localStorage.setItem("user", JSON.stringify(id));
}

export function loadUserIdFromLocalStorage(): string | null {
    const item = localStorage.getItem("user");
    return item ? JSON.parse(item) : null;
}
