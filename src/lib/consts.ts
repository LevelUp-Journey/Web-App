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

export enum ProgrammingLanguage {
    JAVASCRIPT = "JAVASCRIPT",
    PYTHON = "PYTHON",
    JAVA = "JAVA",
    C_PLUS_PLUS = "C_PLUS_PLUS",
}
