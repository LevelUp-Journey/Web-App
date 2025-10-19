export const PATHS = {
    DASHBOARD: {
        ROOT: "/dashboard",
        PROFILE: "/dashboard/profile",
        CHALLENGES: "/dashboard/challenges",
        CHALLENGE: (id: string) => `/dashboard/challenge/${id}`,
        COMMUNITY: "/dashboard/community",
        SETTINGS: "/dashboard/settings",
        HELP: "/dashboard/help",
        ADMINISTRATION: {
            ROOT: "/dashboard/admin",
        },
    },
    AUTH: {
        SIGN_IN: "/auth/sign-in",
        SIGN_UP: {
            ROOT: "/auth/sign-up",
            STEP: (step: number) => `/auth/sign-up?step=${step}`,
        },
    },
    ROOT: "/",
    LEGAL: {
        PRIVACY_POLICY: "/legal/privacy-policy",
        TERMS: "/legal/terms",
    },
    UNAUTHORIZED: "/unauthorized",
};
