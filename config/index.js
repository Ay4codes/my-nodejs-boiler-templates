import ms from "ms";
import dotenv from "dotenv";

dotenv.config();

const DEPLOYMENT_ENV = process.env.NODE_ENV || "development";

const GLOBAL_CONSTANTS = {
    APP_NAME: "Node Js Boiler Template",

    DEFAULT_ACCOUNT: {
        FIRSTNAME: process.env.DEFAULT_ACCOUNT_FIRSTNAME,
        LASTNAME: process.env.DEFAULT_ACCOUNT_LASTNAME,
        EMAIL: process.env.DEFAULT_ACCOUNT_EMAIL,
        PHONE: process.env.DEFAULT_ACCOUNT_PHONE,
        STATUS: process.env.DEFAULT_ACCOUNT_STATUS,
        PASSWORD: process.env.DEFAULT_ACCOUNT_PASSWORD
    },

    DOMAIN: "node.com",
    
    SUPPORT_EMAIL: "support@example.com",
    DEFAULT_EMAIL_FROM: `${"The Node Js Boiler Template Team"} <no-reply@gidisquare.com>`,
    
    ALERTS: {
        SERVER_BACKEND_TEAM_EMAILS: ['ay4codes@gmail.com'],
    },

    MAILER: {
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: process.env.SMTP_PORT,
        SMTP_USER: process.env.SMTP_USER,
        SMTP_PASSWORD: process.env.SMTP_PASSWORD,
        SMTP_SECURE: process.env.SMTP_SECURE === "true" ? true : false,
        REJECT_UNAUTH: process.env.REJECT_UNAUTH === "true" ? true : false
    }
}

const CONFIG_BUILDER = {
    development: {
        ...GLOBAL_CONSTANTS, 

        HOST: {
            API_BASE_URL: "https://localhost:4000",
            AUTH_BASE_URL: "https://localhost:3000",
            LANDING_BASE_URL: "https://localhost:3000",
            CORS_OPTION: ['http://localhost:3000', 'https://localhost:3000'],
        },
        
        AUTH: {
            BCRYPT_SALT: Number(process.env.BCRYPT_SALT) || 10,
            JWT_SECRET: process.env.JWT_SECRET || "jwt-little-secret",
            ENCRYPTION_SECRET: process.env.ENCRYPTION_SECRET || "encryption-little-secret",
            TOKEN_EXPIRES_IN: process.env.TOKEN_EXPIRES_IN ? ms(process.env.TOKEN_EXPIRES_IN) : ms("1h"),
            REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN ? ms(process.env.REFRESH_TOKEN_EXPIRES_IN) : ms("30d"),
            TOKEN_TYPES: {
                refresh: 'refreshToken',
                emailVerification: 'emailVerification',
                passwordReset: 'passwordReset',
                onboarding: 'onboarding',
            }
        },
        
        DB: {
            MONGO_URI: process.env.MONGO_URI,
        },
        
        AUTHORIZATION: {
            ACCESS_KEY: process.env.ACCESS_KEY,
            IPS: {
                WHITE_LISTED: process.env.WHITE_LISTED_IPS || [],
                STATIC_OUTBOUND: process.env.STATIC_OUTBOUND || []
            }
        },

        UPLOADS: {
            PATH: 'uploads'
        }
    },


    production: {
        ...GLOBAL_CONSTANTS,

        HOST: {
            API_BASE_URL: "https://localhost:4000",
            AUTH_BASE_URL: "https://localhost:3000",
            LANDING_BASE_URL: "https://localhost:3000",
            CORS_OPTION: [
                `https://api.${GLOBAL_CONSTANTS.DOMAIN}`,
                `https://${GLOBAL_CONSTANTS.DOMAIN}`,
                `https://staging.${GLOBAL_CONSTANTS.DOMAIN}`,
                `https://admin.${GLOBAL_CONSTANTS.DOMAIN}`,
                `https://staging.admin.${GLOBAL_CONSTANTS.DOMAIN}`,
            ]
        },
        
        AUTH: {
            BCRYPT_SALT: Number(process.env.BCRYPT_SALT) || 10,
            JWT_SECRET: process.env.JWT_SECRET || "jwt-little-secret",
            ENCRYPTION_SECRET: process.env.ENCRYPTION_SECRET || "encryption-little-secret",
            TOKEN_EXPIRES_IN: process.env.TOKEN_EXPIRES_IN ? ms(process.env.TOKEN_EXPIRES_IN) : ms("1h"),
            REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN ? ms(process.env.REFRESH_TOKEN_EXPIRES_IN) : ms("30d"),
            TOKEN_TYPES: {
                refresh: 'refreshToken',
                emailVerification: 'emailVerification',
                passwordReset: 'passwordReset',
                onboarding: 'onboarding',
            }
        },
        
        DB: {
            MONGO_URI: process.env.MONGO_URI,
        },
        
        AUTHORIZATION: {
            ACCESS_KEY: process.env.ACCESS_KEY,
            IPS: {
                WHITE_LISTED: process.env.WHITE_LISTED_IPS || [],
                STATIC_OUTBOUND: process.env.STATIC_OUTBOUND || []
            }
        },

        UPLOADS: {
            PATH: '/var/uploads'
        }
    }
}

// Check if DEPLOYMENT_ENV is valid
if (!Object.keys(CONFIG_BUILDER).includes(DEPLOYMENT_ENV)) {
    throw new Error(`Invalid NODE_ENV: ${DEPLOYMENT_ENV}`);
}

const CONFIG = CONFIG_BUILDER[DEPLOYMENT_ENV];

export { DEPLOYMENT_ENV, CONFIG };