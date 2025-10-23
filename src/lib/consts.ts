export const CONSTS = {
    AUTH_TOKEN_KEY: "token",
    AUTH_REFRESH_TOKEN_KEY: "refresh_token",
    USER_STORE_KEY: "user_store",
    DASHBOARD_CAROUSEL_SPEED: 5000,
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
