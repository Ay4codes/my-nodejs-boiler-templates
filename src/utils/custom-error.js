const logger = require('../logger');
const response = require('./response')

class customErr {
    async customResponse (status, message, reason, data) {
        return {
            status: status ? status : true,
            reason: reason,
            message: message,
            data: data
        }
    }

    async customTooManyReqErr (err, req, res, next) {
        if (err instanceof RateLimitError) {
            logger.error(`Too many request`);
            res.status(429).send(response(false, 'Too many request'));
        } else {
            next();
        }
    }
}

module.exports = new customErr