// Server-side paths helper that accepts locale parameter
export function getLocalizedPaths(locale: string) {
    return {
        DASHBOARD: {
            ROOT: `/${locale}/dashboard`,
            PROFILE: `/${locale}/dashboard/profile`,
            CHALLENGES: {
                ROOT: `/${locale}/dashboard/challenges`,
                CREATE: `/${locale}/dashboard/challenges/create`,
                VIEW: (id: string) => `/${locale}/dashboard/challenges/${id}`,
                VERSIONS: {
                    NEW: (challengeId: string) =>
                        `/${locale}/dashboard/challenges/${challengeId}/versions?editing=true`,
                    VIEW: (challengeId: string, codeVersionId: string) =>
                        `/${locale}/dashboard/challenges/${challengeId}/versions/${codeVersionId}`,
                    EDIT: (challengeId: string, codeVersionId: string) =>
                        `/${locale}/dashboard/challenges/${challengeId}/versions/${codeVersionId}?editing=true`,
                },
                TESTS: {
                    LIST: (challengeId: string, codeVersionId: string) =>
                        `/${locale}/dashboard/challenges/${challengeId}/versions/${codeVersionId}/tests`,
                    NEW: (challengeId: string, codeVersionId: string) =>
                        `/${locale}/dashboard/challenges/${challengeId}/versions/${codeVersionId}/tests?editing=true`,
                    EDIT: (
                        challengeId: string,
                        codeVersionId: string,
                        testId: string,
                    ) =>
                        `/${locale}/dashboard/challenges/${challengeId}/versions/${codeVersionId}/tests?editing=true&testId=${testId}`,
                    VIEW: (
                        challengeId: string,
                        codeVersionId: string,
                        testId: string,
                    ) =>
                        `/${locale}/dashboard/challenges/${challengeId}/versions/${codeVersionId}/tests?testId=${testId}`,
                },
            },
            COMMUNITY: {
                ROOT: `/${locale}/dashboard/community`,
                POST: (id: string) =>
                    `/${locale}/dashboard/community/post/${id}`,
                WITH_ID: (id: string) => `/${locale}/dashboard/community/${id}`,
            },
            LEADERBOARD: `/${locale}/dashboard/leaderboard`,
            SETTINGS: `/${locale}/dashboard/settings`,
            HELP: `/${locale}/dashboard/help`,
            ADMINISTRATION: {
                ROOT: `/${locale}/dashboard/admin`,
                CHALLENGES: {
                    ROOT: `/${locale}/dashboard/admin/challenges`,
                },
                COMMUNITY: {
                    ROOT: `/${locale}/dashboard/admin/community`,
                    CREATE: `/${locale}/dashboard/admin/community/create`,
                    EDIT: (id: string) =>
                        `/${locale}/dashboard/admin/community/edit?id=${id}`,
                },
                COURSES: {
                    ROOT: `/${locale}/dashboard/admin/courses`,
                    CREATE: `/${locale}/dashboard/admin/courses/create`,
                },
                GUIDES: {
                    ROOT: `/${locale}/dashboard/admin/guides`,
                    CREATE: `/${locale}/dashboard/admin/guides/create`,
                    VIEW: (id: string) =>
                        `/${locale}/dashboard/admin/guides/${id}`,
                    EDIT: (id: string) =>
                        `/${locale}/dashboard/admin/guides/${id}/edit`,
                },
            },
            COURSES: {
                ROOT: `/${locale}/dashboard/courses`,
                CREATE: `/${locale}/dashboard/courses/create`,
                EDIT: (id: string) =>
                    `/${locale}/dashboard/courses/edit?id=${id}`,
                VIEW: (id: string) => `/${locale}/dashboard/courses/${id}`,
                GUIDES: {
                    ROOT: (courseId: string) =>
                        `/${locale}/dashboard/courses/${courseId}/guides`,
                    VIEW: (courseId: string, guideId: string) =>
                        `/${locale}/dashboard/courses/${courseId}/guides/${guideId}`,
                },
            },
        },
        AUTH: {
            SIGN_IN: `/${locale}/auth/sign-in`,
            SIGN_UP: {
                ROOT: `/${locale}/auth/sign-up`,
                STEP: (step: number) => `/${locale}/auth/sign-up?step=${step}`,
            },
        },
        ROOT: `/${locale}`,
        LEGAL: {
            PRIVACY_POLICY: `/${locale}/legal/privacy-policy`,
            TERMS: `/${locale}/legal/terms`,
        },
        UNAUTHORIZED: `/${locale}/unauthorized`,
    };
}

// Default export with English locale for backwards compatibility
// WARNING: This should only be used in server components or you should use useLocalizedPaths() hook
export const PATHS = getLocalizedPaths("en");
