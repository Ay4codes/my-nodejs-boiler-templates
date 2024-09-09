import ms from "ms";
import dotenv from "dotenv";

dotenv.config();

const DEPLOYMENT_ENV = process.env.NODE_ENV || "development";

const GLOBAL_CONSTANTS = {
    APP_NAME: "Gidisquare",
    
    SUPPORT_EMAIL: "support@gidisquare.com",
    DEFAULT_EMAIL_FROM: `${"The Gidisquare Team"} <${process.env.MAILER_USER}>`,
    
    ROLES: ['user', 'admin', 'super_admin'],
    
    SUPPORTED_COUNTRIES: ['UK'],
    
    ALERTS: {
        SERVER_BACKEND_TEAM_EMAILS: ['ay4codes@gmail.com'],
    },

    MAILER: {
        SMTP_HOST: process.env.MAILER_HOST,
        SMTP_PORT: process.env.MAILER_PORT,
        SMTP_USER: process.env.MAILER_USER,
        SMTP_PASSWORD: process.env.MAILER_PASSWORD,
        SECURE: process.env.MAILER_SECURE === "true" ? true : false,
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
        },
        
        AUTH: {
            BCRYPT_SALT: Number(process.env.BCRYPT_SALT) || 10,
            JWT_SECRET: process.env.JWT_SECRET || "jwt-little-secret",
            TOKEN_EXPIRES_IN: process.env.TOKEN_EXPIRES_IN ? ms(process.env.TOKEN_EXPIRES_IN) : ms("1h"),
            REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN ? ms(process.env.REFRESH_TOKEN_EXPIRES_IN) : ms("30d"),
            TOKEN_TYPES: {
                refresh: 'refresh_token',
                email_verification: 'email_verification',
                password_reset: 'password_reset'
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
        }
    },


    production: {
        ...GLOBAL_CONSTANTS,

        HOST: {
            API_BASE_URL: "https://localhost:4000",
            AUTH_BASE_URL: "https://localhost:3000",
            LANDING_BASE_URL: "https://localhost:3000",
        },
        
        AUTH: {
            BCRYPT_SALT: Number(process.env.BCRYPT_SALT) || 10,
            JWT_SECRET: process.env.JWT_SECRET || "jwt-little-secret",
            TOKEN_EXPIRES_IN: process.env.TOKEN_EXPIRES_IN ? ms(process.env.TOKEN_EXPIRES_IN) : ms("1h"),
            REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN ? ms(process.env.REFRESH_TOKEN_EXPIRES_IN) : ms("30d"),
            TOKEN_TYPES: {
                refresh: 'refresh_token',
                email_verification: 'email_verification',
                password_reset: 'password_reset'
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
        }
    }
}

// Check if DEPLOYMENT_ENV is valid
if (!Object.keys(CONFIG_BUILDER).includes(DEPLOYMENT_ENV)) {
    throw new Error(`Invalid NODE_ENV: ${DEPLOYMENT_ENV}`);
}

const CONFIG = CONFIG_BUILDER[DEPLOYMENT_ENV];

export { DEPLOYMENT_ENV, CONFIG };