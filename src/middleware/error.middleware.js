const Sentry = require('@sentry/node')
const response = require("../utils/response");
const { customResponse } = require("../utils/custom-error");

const errorMiddlewareConfig = (app) => {
    // Sentry error handler
    app.use(Sentry.Handlers.errorHandler());

    app.use((err, req, res, next) => {

        if (err instanceof SyntaxError && 'body' in err) return res.status(400).json(customResponse(false, 'Error', 'Invalid JSON'));
        
        return res.status(500).json(customResponse(false, 'Error', err.message))

    })

    // Handle 404 requests
    app.use("*", (req, res) => {

        res.status(404).json(response(false, 'Invalid request url'));

    });
}

module.exports = {errorMiddlewareConfig}