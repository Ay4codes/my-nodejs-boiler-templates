import User from "../models/user.model.js";
import tokenServices from "../services/token.services.js";
import response from "../utils/response.js";
import customDate from '../utils/date.js'
import ValidationSchema from "../utils/validators.schema.js";
import { CONFIG } from "../../config/index.js";

class Auth {

    async apiGuard (req, res, next) {
    
        const { 'x-api-key': apiKey } = req.headers;

        if (apiKey !== CONFIG.AUTHORIZATION.ACCESS_KEY) return res.status(401).json(response(false, 'Unauthorized access', undefined, '-x-api-key-required'))

        next()

    }

    async authGuard (req, res, next) {
        
        if (!req.headers.authorization) return res.status(400).json(response(false, 'Auth token is required'))

        const decodedToken = await tokenServices.decodeToken(req.headers.authorization)

        if (!decodedToken.status) return res.status(401).json(response(false, 'Auth token expired', null, '-token-expired'))

        const {error, value: data} = ValidationSchema.getUser.validate({user_id: decodedToken.user.user_id})

        if (error) return {success: false, status: 400, message: error.message}

        const user = await User.findOne({_id: data.user_id}).populate({path: 'role', populate: {path: 'privileges'}}).populate('position').populate('department').select('+email_verified +last_seen')

        if (!user) return res.status(404).json(response(false, 'User not found'))

        if (user.status === 'disabled' || user.status === 'inactive') return res.status(401).json(response(false, 'Account disabled or inactive', null, '-account-disabled'))

        if (user.status === 'pending') return res.status(401).json(response(false, 'Email not verified', null, '-email-not-verified'))

        await userModel.updateOne({_id: data.user_id}, {last_seen: customDate.now()})

        req.user = user;

        next()

    }

    checkPrivilege = (privilegeName) => (req, res, next) => {
        
        const user = req.user
        
        const hasPrivilege = user.roles.some(role => role.privileges.some(priv => priv.name === privilegeName))
        
        if (!hasPrivilege) return res.status(403).json(response(false, 'Insufficient privileges'))
        
        next()
    
    }

}

export default new Auth