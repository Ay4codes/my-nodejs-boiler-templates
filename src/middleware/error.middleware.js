const Sentry = require('@sentry/node')
const response = require("../utils/response");
const { customResponse } = require("../utils/custom-error");

const errorMiddlewareConfig = (app) => {
    // Sentry error handler
    app.use(Sentry.Handlers.errorHandler());

    app.use((err, req, res, next) => {
        res.status(500).json(customResponse(false, 'Error', 'Something broke!'))
    })

    // Handle 404 requests
    app.use("*", (req, res) => {
        res.status(404).json(response(false, 'Invalid request'));
    });
}

module.exports = {errorMiddlewareConfig}