const { User } = require("../models/user.model");
const tokenServices = require("../services/token.services");
const response = require("../utils/response");
const Sentry = require('@sentry/node')
const customDate = require('../utils/date');

class Auth {

    async authGuard (req, res, next) {
        
        if (!req.headers.token) return res.status(401).json(response(false, 'Auth token is required'))

        const decodedToken = await tokenServices.decodeToken(req.headers.token)

        if (!decodedToken.status) return res.status(409).json(response(false, 'Auth token expired'))

        const user = await User.findOne({_id: decodedToken.user_id})

        if (!user) return res.status(401).json(response(false, 'User not found'))

        if (user.account_disabled) return res.status(401).json(response(false, 'User account disabled'))

        if (user.email_verified) return res.status(401).json(response(false, 'Email not verified'))

        if (user.identity_verified) return res.status(401).json(response(false, 'Identity not verified'))

        await User.updateOne({_id: decodedToken.user_id}, {last_seen: customDate.now()})

        Sentry.setUser({id: (user._id).toString(), email: user.email})

        req.user = user;

        next()

    }

}

module.exports = new Auth