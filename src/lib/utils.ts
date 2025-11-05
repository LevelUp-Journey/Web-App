import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ProgrammingLanguage } from "./consts";

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

export const getMonacoLanguage = (language: ProgrammingLanguage): string => {
    switch (language) {
        case ProgrammingLanguage.JAVASCRIPT:
            return "javascript";
        case ProgrammingLanguage.PYTHON:
            return "python";
        case ProgrammingLanguage.JAVA:
            return "java";
        case ProgrammingLanguage.C_PLUS_PLUS:
            return "cpp";
        default:
            return "javascript";
    }
};
