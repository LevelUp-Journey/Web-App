import "server-only";

const dictionaries = {
    en: () => import("./dictionaries/en.json").then((module) => module.default),
    es: () => import("./dictionaries/es.json").then((module) => module.default),
};

export type Locale = keyof typeof dictionaries;

export const getDictionary = async (locale: Locale) => {
    // Validate locale to prevent injection
    if (!dictionaries[locale]) {
        return dictionaries.en();
    }
    return dictionaries[locale]();
};

export const locales = Object.keys(dictionaries) as Locale[];
export const defaultLocale: Locale = "en";
