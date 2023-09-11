const logger = require("../logger");

const logIncomingRequest = (req, res, next) => {
    logger.info(`Request received: method---${req.method} ::::: route---${req.url}`);
    next();
}

module.exports = logIncomingRequest