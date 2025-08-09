require('dotenv').config();

export type EnvConfig = {
    port: number;
    swagger: {
        username: string;
        password: string;
    };
    mongoUrl: string;
    jwtSecret: string;
    devAuthPassword: string;
    isDevEnv: boolean;
};

export const envConfig: EnvConfig = {
    port: Number(process.env.PORT) || 3000,
    swagger: {
        username: process.env.SWAGGER_USERNAME,
        password: process.env.SWAGGER_PASSWORD,
    },
    mongoUrl: process.env.MONGO_URL,
    jwtSecret: process.env.JWT_SECRET,
    devAuthPassword: process.env.DEV_AUTH_PASSWORD,
    isDevEnv: process.env.IS_DEV_ENV === 'true',
};
