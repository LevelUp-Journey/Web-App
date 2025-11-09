"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import { useLocale } from "./use-locale";

const dictionaries = {
    en: () =>
        import("../app/[lang]/dictionaries/en.json").then(
            (module) => module.default,
        ),
    es: () =>
        import("../app/[lang]/dictionaries/es.json").then(
            (module) => module.default,
        ),
};

export function useDictionary(): Dictionary | null {
    const locale = useLocale();
    const [dict, setDict] = useState<Dictionary | null>(null);

    useEffect(() => {
        // Validate locale to prevent injection
        if (!dictionaries[locale as keyof typeof dictionaries]) {
            dictionaries.en().then(setDict);
            return;
        }

        dictionaries[locale as keyof typeof dictionaries]().then(setDict);
    }, [locale]);

    return dict;
}
