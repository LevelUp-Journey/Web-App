import "server-only";

const dictionaries = {
    en: () => import("./dictionaries/en.json").then((module) => module.default),
    es: () => import("./dictionaries/es.json").then((module) => module.default),
};

export type Locale = keyof typeof dictionaries;

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
    // Validate locale to prevent injection
    if (!dictionaries[locale]) {
        return dictionaries.en() as unknown as Promise<Dictionary>;
    }
    return dictionaries[locale]() as unknown as Promise<Dictionary>;
};

export const locales = Object.keys(dictionaries) as Locale[];
export const defaultLocale: Locale = "en";

// Type definition for the dictionary structure
export interface Dictionary {
    navigation: {
        home: string;
        dashboard: string;
        challenges: string;
        profile: string;
        settings: string;
        logout: string;
        login: string;
        signup: string;
        leaderboard: string;
        guides: string;
        help: string;
        adminDashboard: string;
        language: string;
    };
    common: {
        loading: string;
        error: string;
        success: string;
        cancel: string;
        save: string;
        delete: string;
        edit: string;
        create: string;
        update: string;
        search: string;
        filter: string;
        sort: string;
        actions: string;
        back: string;
        next: string;
        previous: string;
        submit: string;
        close: string;
        confirm: string;
        yes: string;
        no: string;
    };
    help: {
        title: string;
        suggestionsTitle: string;
        description: string;
        label: string;
        placeholder: string;
        submitButton: string;
        successToast: string;
        validation: {
            required: string;
        };
    };
    feedback: {
        title: string;
        description: string;
        noSuggestions: string;
        table: {
            date: string;
            suggestion: string;
        };
    };
    leaderboard: {
        ranking: string;
        myRank: string;
        information: string;
        table: {
            position: string;
            rank: string;
            username: string;
            points: string;
        };
        loading: {
            leaderboard: string;
            rank: string;
        };
        empty: {
            noUsers: string;
            noRankInfo: string;
            loadError: string;
        };
        ui: {
            retry: string;
            rankingSystem: string;
            myCurrentRank: string;
        };
        ranks: {
            bronze: { name: string; description: string };
            silver: { name: string; description: string };
            gold: { name: string; description: string };
            platinum: { name: string; description: string };
            diamond: { name: string; description: string };
            master: { name: string; description: string };
            grandmaster: { name: string; description: string };
        };
        rankingSystem: {
            overview: {
                title: string;
                description: string;
            };
            byScore: {
                ranges: {
                    bronze: string;
                    silver: string;
                    gold: string;
                    platinum: string;
                    diamond: string;
                    master: string;
                    grandmaster: string;
                };
            };
            rules: {
                title: string;
                description: string;
                maximumScoresIntro: string;
                difficultyLevels: {
                    easy: string;
                    medium: string;
                    hard: string;
                    expert: string;
                };
                sections: {
                    difficultyCeiling: {
                        title: string;
                        summary: string;
                        items: string[];
                    };
                    correctnessFirst: {
                        title: string;
                        summary: string;
                        items: string[];
                    };
                    timePercentage: {
                        title: string;
                        summary: string;
                        items: string[];
                    };
                    minimumScore: {
                        title: string;
                        summary: string;
                        items: string[];
                    };
                    timeTracking: {
                        title: string;
                        summary: string;
                        items: string[];
                    };
                    summaryHierarchy: {
                        title: string;
                        summary: string;
                        items: string[];
                    };
                };
            };
            penalization: {
                title: string;
                description: string;
            };
        };
    };
    admin: {
        layout: {
            general: string;
            challenges: string;
            guides: string;
            community: string;
            feedback: string;
        };
        dashboard: {
            title: string;
            loading: string;
            loadingDescription: string;
            error: string;
            errorDescription: string;
            retry: string;
            challenges: string;
            noChallenges: string;
            guides: string;
            noGuides: string;
        };
        community: {
            title: string;
            subtitle: string;
            create: string;
            loading: string;
            loadingDescription: string;
            error: string;
            noCommunities: string;
            noCommunitiesDescription: string;
            retry: string;
            permissionsError: string;
            createForm: {
                title: string;
                subtitle: string;
                nameLabel: string;
                namePlaceholder: string;
                descriptionLabel: string;
                descriptionPlaceholder: string;
                descriptionHelper: string;
                termsText: string;
                submitButton: string;
                cancelConfirm: string;
                errorCreating: string;
                validation: {
                    nameRequired: string;
                    nameMax: string;
                    descriptionMin: string;
                    descriptionMax: string;
                };
            };
        };
        challenges: {
            title: string;
            createNew: string;
            create: string;
            noChallenges: string;
            noChallengesDescription: string;
            error: string;
            errorDescription: string;
        };
        guides: {
            title: string;
            subtitle: string;
            create: string;
            loading: string;
            loadingDescription: string;
            accessDenied: string;
            accessDeniedDescription: string;
            permissionsError: string;
            noGuides: string;
            noGuidesDescription: string;
            error: string;
            errorDescription: string;
            retry: string;
            showing: string;
            to: string;
            of: string;
            perPage: string;
            createGuide: {
                title: string;
                subtitle: string;
                validation: {
                    titleRequired: string;
                    descriptionMin: string;
                    descriptionMax: string;
                    topicsRequired: string;
                };
                errorCreating: string;
                cancelConfirm: string;
            };
            editGuide: {
                subtitle: string;
                publish: string;
                publishing: string;
                backToGuides: string;
                tabs: {
                    pages: string;
                    challenges: string;
                    info: string;
                };
                basicInfo: {
                    title: string;
                    subtitle: string;
                    update: string;
                    updating: string;
                    updateSuccess: string;
                    updateError: string;
                    cancelConfirm: string;
                    publishError: string;
                };
                validation: {
                    titleRequired: string;
                    descriptionMin: string;
                    descriptionMax: string;
                    topicsRequired: string;
                };
                notFound: string;
                loading: string;
            };
        };
    };
    [key: string]: any;
}
