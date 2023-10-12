const { secutiry } = require("../../config");
const logger = require("../logger");
const whitelists = secutiry.ips.WHITE_LISTED
const static = secutiry.ips.STATIC_OUTBOUND
const ips = whitelists.concat(static)

const whiteListIpAddress = (req, res, next) => {
  const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const ipAddresses = ipAddress?.split(',').map((ip) => ip.trim());

  const allowedIpAddresses = ips;

  if (!allowedIpAddresses.includes(ipAddresses[0])) {
    logger.warn(`Attempt to access from an Unauthorized IP !!!. ROUTE<:::>${req.url} --- IP<:::>${ipAddresses[0]}`);
    return res.status(498).json({ error: 'Unauthorized access' });
  }

  next();
};
  
module.exports = { whiteListIpAddress };