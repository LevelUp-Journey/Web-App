export const CONSTS = {
    AUTH_TOKEN_KEY: "token",
    AUTH_REFRESH_TOKEN_KEY: "refresh_token",
    USER_STORE_KEY: "user_store",
    DASHBOARD_CAROUSEL_SPEED: 5000,
    SOLUTION_UPDATE_DELAY: 1500,
};

export enum UIVersion {
    A = "A",
    B = "B",
    C = "C",
}

export enum UserRole {
    ADMIN = "ROLE_ADMIN",
    STUDENT = "ROLE_STUDENT",
    TEACHER = "ROLE_TEACHER",
}

export enum ChallengeDifficulty {
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD",
    EXPERT = "EXPERT",
}

export const CHALLENGE_DIFFICULTY_MAX_XP: Record<ChallengeDifficulty, number> =
    {
        [ChallengeDifficulty.EASY]: 5,
        [ChallengeDifficulty.MEDIUM]: 10,
        [ChallengeDifficulty.HARD]: 20,
        [ChallengeDifficulty.EXPERT]: 40,
    };

export const MAX_CHALLENGE_EXPERIENCE_POINTS = Math.max(
    ...Object.values(CHALLENGE_DIFFICULTY_MAX_XP),
);

export enum ChallengeStatus {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
}

export enum ProgrammingLanguage {
    JAVASCRIPT = "JAVASCRIPT",
    PYTHON = "PYTHON",
    JAVA = "JAVA",
    C_PLUS_PLUS = "C_PLUS_PLUS",
}

export function getReadableLanguageName(language: string): string {
    switch (language) {
        case ProgrammingLanguage.JAVASCRIPT:
            return "JavaScript";
        case ProgrammingLanguage.PYTHON:
            return "Python";
        case ProgrammingLanguage.JAVA:
            return "Java";
        case ProgrammingLanguage.C_PLUS_PLUS:
            return "C++";
        default:
            // Handle unknown languages by capitalizing the first letter
            return (
                language.charAt(0).toUpperCase() +
                language.slice(1).toLowerCase()
            );
    }
}
