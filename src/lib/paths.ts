export const PATHS = {
    DASHBOARD: {
        ROOT: "/dashboard",
        PROFILE: "/dashboard/profile",
        CHALLENGES: {
            ROOT: "/dashboard/challenges",
            CREATE: "/dashboard/challenges/create",
            EDIT: (id: string) => `/dashboard/challenges/edit/${id}`,
            WITH_ID: (id: string) => `/dashboard/challenge/${id}`,
            VERSIONS: {
                ROOT: "/dashboard/challenges/versions",
                ADD: (id: string) =>
                    `/dashboard/challenges/edit/${id}/versions?editing=true`,
            },
            TESTS: {
                ROOT: "/dashboard/challenges/tests",
                ADD: (id: string) => `/dashboard/challenges/edit/${id}/tests`,
            },
        },
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
