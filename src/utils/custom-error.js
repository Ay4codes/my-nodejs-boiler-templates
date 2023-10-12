const logger = require('../logger');
const response = require('./response')

class customErr {
    customResponse (status, message, reason, data) {
        return {
            status: status,
            reason: reason,
            message: message,
            data: data
        }
    }

    customTooManyReqErr (err, req, res, next) {
        if (err instanceof RateLimitError) {
            logger.error(`Too many request`);
            res.status(429).send(response(false, 'Too many request'));
        } else {
            next();
        }
    }
}

module.exports = new customErr