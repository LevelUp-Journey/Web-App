export const ENV = {
    SERVICES: {
        IAM: {
            BASE_URL:
                process.env.IAM_BASE_URL || "http://192.168.0.119:8081/api/v1",
        },
    },
};
