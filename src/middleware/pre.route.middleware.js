const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('../logger');
const helmet = require('helmet');
const trimRequestBody = require('../utils/trim-object-strings');
const { domain } = require('../../config');
const { limiter } = require('./rate.limit.middleware');
const logIncomingRequest = require('../logger/incomming-req-logger');
const helmetConfig = require('./helmetConfig');
const customError = require('../utils/custom-error');

const corsOptions = {
    origin: [domain.API, domain.WEB], // List of allowed origins
    methods: 'GET', // Only allowed request according to the task given
    allowedHeaders: 'Content-Type,Authorization',
};

module.exports = (app) => {
    // Enable trust proxy for handling proxied requests
    app.enable('trust proxy');

    // Serve Public Folder
    app.use("/", express.static(path.join(__dirname, "..", "..", "public")));

    // Use middleware to parse JSON request bodies
    app.use(express.json());

    // Use middleware for parsing URL-encoded request bodies with extended support
    app.use(bodyParser.urlencoded({extended: true}));

    // Enable CORS protection with custom options
    app.use(cors(corsOptions));

    // Use middleware to parse cookies
    app.use(cookieParser());

    // Use custom middleware to trim object strings
    app.use(trimRequestBody);

    // Set trust proxy level
    app.set('trust proxy', 1);

    // Configure rate limiting middleware
    app.use(limiter);

    // Custom "Too Many Requests" Error Handling Middleware for api abuse
    app.use(customError.customTooManyReqErr);

    // Use helmet middleware to set security headers with default and custom directives
    app.use(helmet(helmetConfig));

    // Add a custom logger to the Express app
    app.logger = logger;

    // Log each incoming request with method and route information
    app.use(logIncomingRequest);
};