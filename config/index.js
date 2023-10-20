const ms = require('ms')
require('dotenv').config()

const config = {
    APP_NAME: "My-Template",
    domain: {
        BASE_URL: 'https://api.my-template.com',
        LANDING_URL: 'https://my-template.com'
    },
    BCRYPT_SALT: Number(process.env.BCRYPT_SALT) || 10,
    auth: {
        jwt: {
            JWT_SECRET: process.env.JWT_SECRET || "jwt-little-secret",
            TOKEN_EXPIRES_IN: process.env.TOKEN_EXPIRES_IN ? ms(process.env.TOKEN_EXPIRES_IN) : ms("1h"),
            REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN ? ms(process.env.REFRESH_TOKEN_EXPIRES_IN) : ms("30d"),
        },
        tokens_types: {
            refresh: 'refresh_token',
            email_verification: 'email_verification',
            password_reset: 'password_reset'
        }
    },
    secutiry: {
        apikey: {
            ACCESS_KEY: process.env.ACCESS_KEY
        },
        ips: {
            WHITE_LISTED: process.env.WHITE_LISTED_IPS || [],
            STATIC_OUTBOUND: process.env.STATIC_OUTBOUND || []
        }
    },
    database: {
        connection: {
            MONGO_URI: process.env.MONGO_URI,
        }
    },
    mailer: {
        HOST: process.env.MAILER_HOST,
        PORT: process.env.MAILER_PORT,
        SECURE: process.env.MAILER_SECURE === 'true' ? false : false,
        USER: process.env.MAILER_USER,
        PASSWORD: process.env.MAILER_PASSWORD,
        DEFAULT_FROM: `${"The Template Team"} <${process.env.MAILER_USER}>`,
        SUPPORT: 'support@my-template.com'
    },
    sentry: {
        DSN: process.env.SENTRY_DSN,
    },
};

// console.log("CONFIGS:", CONFIGS); --->>> to check if config is set
module.exports = config;