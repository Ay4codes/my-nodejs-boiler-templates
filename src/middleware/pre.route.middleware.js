import express from "express";
import path from 'path'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { helmetConfig } from "../../config/helmet.js";
import morgan from 'morgan'
import trimIncomingRequest from "./trim-incoming.middleware.js";
import { fileURLToPath } from 'url';
import logger from "../logger/index.js";
import configureErrorMiddleware from "./error.middleware.js";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const configurePreRouteMiddleware = (app) => {

    // Enable trust proxy for handling proxied requests
    app.enable('trust proxy');

    // Enable CORS protection with custom options
    app.use(cors());

    // Use helmet middleware to set security headers with default and custom directives
    app.use(helmet(helmetConfig));

    // Enable HTTP request logging
    app.use(morgan("common"));

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

    // Error middleware
    app.use(configureErrorMiddleware);

    return app;
    
};

export default configurePreRouteMiddleware