import express from "express";
import path from 'path'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { helmetConfig } from "../../config/helmet.js";
import morgan from 'morgan'
import trimIncomingRequest from "./trim-incoming.middleware.js";
import { fileURLToPath } from 'url';
import configureErrorMiddleware from "./error.middleware.js";
import { CONFIG, DEPLOYMENT_ENV } from "../../config/index.js";
import logger from "../logger/index.js";
import swaggerUi  from 'swagger-ui-express'
import fs from 'fs';
import Auth from '../middleware/auth.middleware.js'

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, '../../swagger.json'), 'utf8'));

const corsOptions = {
    
    origin: [CONFIG.HOST.CORS_OPTION],
    
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    
    credentials: true,

};

const configurePreRouteMiddleware = (app) => {

    // Enable trust proxy for handling proxied requests
    app.enable('trust proxy');

    // Enable CORS protection with custom options
    app.use(cors(corsOptions));

    // Use helmet middleware to set security headers with default and custom directives
    app.use(helmet(helmetConfig));

    // Enable HTTP request logging
    app.use(morgan("common"));

    app.use('/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // Serve Upload Folder
    app.use("/uploads", express.static(DEPLOYMENT_ENV === 'development' ? path.join(__dirname, "..", "..", "public", CONFIG.UPLOADS.PATH) : CONFIG.UPLOADS.PATH));

    // Use middleware to parse JSON request bodies
    app.use(express.json());

    // Serve Public Folder
    app.use("/", express.static(path.join(__dirname, "..", "..", "public")));

    // Express body parser
    app.use(express.urlencoded({ extended: true }));

    // Use middleware to parse cookies
    app.use(cookieParser());

    // Use custom middleware to trim object strings
    app.use(trimIncomingRequest);

    //App Guard
    app.use(Auth.apiGuard)

    // Error middleware
    app.use(configureErrorMiddleware);

    // Logger
    app.logger = logger;

    return app;
    
};

export default configurePreRouteMiddleware