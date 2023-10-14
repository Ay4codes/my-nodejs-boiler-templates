const rateLimit = require('express-rate-limit');
const ms = require('ms');

const limiter = rateLimit({
    windowMs: ms('15m'), // 15 minutes
    max: 120, // Limit each IP to 120 requests per 15-minute window
    trustProxy: true // Trust the "X-Forwarded-For" header for proxy support
});

module.exports = {limiter}