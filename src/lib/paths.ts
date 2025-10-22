export const PATHS = {
    DASHBOARD: {
        ROOT: "/dashboard",
        PROFILE: "/dashboard/profile",
        CHALLENGES: {
            ROOT: "/dashboard/challenges",
            CREATE: "/dashboard/challenges/create",
            // View challenge summary (read-only)
            VIEW: (id: string) => `/dashboard/challenges/${id}`,
            // Edit challenge (editable)
            EDIT: (id: string) => `/dashboard/challenges/edit/${id}`,
            // Code Versions
            VERSIONS: {
                // Create new code version
                NEW: (challengeId: string) =>
                    `/dashboard/challenges/edit/${challengeId}/versions/new`,
                // View code version summary (read-only)
                VIEW: (challengeId: string, codeVersionId: string) =>
                    `/dashboard/challenges/edit/${challengeId}/versions/${codeVersionId}`,
                // Edit code version (editable)
                EDIT: (challengeId: string, codeVersionId: string) =>
                    `/dashboard/challenges/edit/${challengeId}/versions/${codeVersionId}?editing=true`,
            },
            // Tests
            TESTS: {
                // View all tests for a code version
                LIST: (challengeId: string, codeVersionId: string) =>
                    `/dashboard/challenges/edit/${challengeId}/versions/${codeVersionId}/tests`,
                // Create new test
                NEW: (challengeId: string, codeVersionId: string) =>
                    `/dashboard/challenges/edit/${challengeId}/versions/${codeVersionId}/tests?editing=true`,
                // Edit specific test
                EDIT: (
                    challengeId: string,
                    codeVersionId: string,
                    testId: string,
                ) =>
                    `/dashboard/challenges/edit/${challengeId}/versions/${codeVersionId}/tests?editing=true&testId=${testId}`,
                // View specific test
                VIEW: (
                    challengeId: string,
                    codeVersionId: string,
                    testId: string,
                ) =>
                    `/dashboard/challenges/edit/${challengeId}/versions/${codeVersionId}/tests?testId=${testId}`,
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
