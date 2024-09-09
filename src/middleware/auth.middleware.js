import User from "../models/user.model.js";
import tokenServices from "../services/token.services.js";
import response from "../utils/response.js";
import customDate from '../utils/date.js'
import ValidationSchema from "../utils/validators.schema.js";

class Auth {

    async authGuard (req, res, next) {
        
        if (!req.headers.token) return res.status(400).json(response(false, 'Auth token is required'))

        const decodedToken = await tokenServices.decodeToken(req.headers.token)

        if (!decodedToken.status) return res.status(401).json(response(false, 'Auth token expired', null, '-token-expired'))

        const {error, value: data} = ValidationSchema.getUser.validate({user_id: decodedToken.user.user_id})

        if (error) return {success: false, status: 400, message: error.message}

        const user = await User.findOne({_id: data.user_id})

        if (!user) return res.status(404).json(response(false, 'User not found'))

        if (user.account_disabled) return res.status(401).json(response(false, 'Account disabled', null, '-account-disabled'))

        if (!user.email_verified) return res.status(401).json(response(false, 'Email not verified', null, '-email-not-verified'))

        if (!user.identity_verified) return res.status(401).json(response(false, 'Identity not verified', null, '-identity-not-veiified'))

        await userModel.updateOne({_id: data.user_id}, {last_seen: customDate.now()})

        req.user = user;

        next()

    }

}

export default new Auth