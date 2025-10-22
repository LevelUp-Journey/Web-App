export const ENV = {
    SERVICES: {
        IAM: {
            BASE_URL: process.env.IAM_BASE_URL!,
        },
        PROFILE: {
            BASE_URL: process.env.PROFILE_BASE_URL!,
        },
        CHALLENGES: {
            BASE_URL: process.env.CHALLENGES_BASE_URL!,
        },
        COMMUNITY: {
            BASE_URL: process.env.COMMUNITY_BASE_URL!,
        },
        EXTERNAL: {
            CLOUDINARY: {
                CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
                API_KEY: process.env.CLOUDINARY_API_KEY!,
                API_SECRET: process.env.CLOUDINARY_API_SECRET!,
            },
        },
    },
};
