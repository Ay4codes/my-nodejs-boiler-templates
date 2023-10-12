const ms = require('ms')
require('dotenv').config()

const config = {
    APP_NAME: "hng-task-one",
    domain: {
        API: 'https://api.my-template.com',
        WEB: 'https://my-template.com'
    },
    BCRYPT_SALT: Number(process.env.BCRYPT_SALT) || 10,
    auth: {
        jwt: {
            JWT_SECRET: process.env.JWT_SECRET || "jwt-little-secret",
            TOKEN_EXPIRES_IN: process.env.TOKEN_EXPIRES_IN ? ms(process.env.TOKEN_EXPIRES_IN) : ms("1h"),
            REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN ? ms(process.env.REFRESH_TOKEN_EXPIRES_IN) : ms("30d"),
        }
    },
    secutiry: {
        apikey: {
            ACCESS_KEY: process.env.ACCESS_KEY
        },
        ips: {
            WHITE_LISTED: process.env.WHITE_LISTED_IPS
        }
    },
    database: {
        connection: {
            MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/my-templateDB",
        },
        access: {
            DB_TOKEN_EXPIRY_DURATION: process.env.DB_TOKEN_EXPIRY_DURATION ? ms(process.env.DB_TOKEN_EXPIRY_DURATION) : ms("15m"),
        }
    },
    roles: {
        USER: ["user", "admin"],
        ADMIN: ["admin"],
    },
    mail: {
        HOST: process.env.MAILER_HOST,
        USER: process.env.MAILER_USER,
        PASSWORD: process.env.MAILER_PASSWORD,
        PORT: process.env.MAILER_PORT,
        SECURE: process.env.MAILER_SECURE || true,
        DOMAIN: "url",
        ADMIN: process.env.ADMIN,
        SUPPORT: process.env.SUPPORT,
        DEFAULT_EMAIL_FROM: "my-template <no-reply@my-template.com>",
    },
    sentry: {
        DSN: process.env.SENTRY_DSN,
    },
};

// console.log("CONFIGS:", CONFIGS); --->>> to check if config is set
module.exports = config;