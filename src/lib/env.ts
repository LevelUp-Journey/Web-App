export const ENV = {
    SERVICES: {
        IAM: {
            BASE_URL:
                process.env.IAM_BASE_URL || "http://192.168.0.119:8081/api/v1",
        },
        EXTERNAL: {
            CLOUDINARY: {
                CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
                API_KEY: process.env.CLOUDINARY_API_KEY,
                API_SECRET: process.env.CLOUDINARY_API_SECRET,
            },
        },
    },
};
