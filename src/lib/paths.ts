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
        },
        COMMUNITY: {
            ROOT: "/dashboard/community",
            POST: (id: string) => `/dashboard/community/${id}`,
        },
        SETTINGS: "/dashboard/settings",
        HELP: "/dashboard/help",
        ADMINISTRATION: {
            ROOT: "/dashboard/admin",
            COMMUNITY: {
                ROOT: "/dashboard/admin/community",
                CREATE: "/dashboard/admin/community/create",
                EDIT: (id: string) => `/dashboard/admin/community/edit?id=${id}`,
            },
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
