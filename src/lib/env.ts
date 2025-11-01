export const ENV = {
    SERVICES: {
        IAM: {
            BASE_URL:
                process.env.IAM_BASE_URL || "http://192.168.0.118:8081/api/v1",
        },
        PROFILE: {
            BASE_URL:
                process.env.PROFILE_BASE_URL ||
                "http://192.168.0.118:8082/api/v1",
        },
        CHALLENGES: {
            BASE_URL:
                process.env.CHALLENGES_BASE_URL ||
                "http://192.168.0.118:8083/api/v1",
        },
        COMMUNITY: {
            BASE_URL:
                process.env.COMMUNITIES_BASE_URL ||
                "http://192.168.0.118:8086/api/v1",
        },
        LEARNING: {
            BASE_URL:
                process.env.LEARNING_BASE_URL || "http://localhost:8085/api/v1",
        },
        EXTERNAL: {
            CLOUDINARY: {
                CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
                API_KEY: process.env.CLOUDINARY_API_KEY,
                API_SECRET: process.env.CLOUDINARY_API_SECRET,
            },
        },
    },
    OAUTH: {
        GOOGLE: {
            AUTH_URL: process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL || "",
        },
        GITHUB: {
            AUTH_URL: process.env.NEXT_PUBLIC_GITHUB_AUTH_URL || "",
        },
    },
};
