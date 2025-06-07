import bcrypt from 'bcrypt'
import { CONFIG } from '../../config/index.js';
import User from '../models/user.model.js';
import ValidationSchema from '../utils/validators.schema.js';
import TokenServices from './token.services.js';
import mailerServices from './mailer.services.js'
import RoleHistory from '../models/role.history.model.js';


class UserServices {

    async createUser(user, body) {

        const {error, value: data} = ValidationSchema.createUser.validate(body)
        
        if (error) return {success: false, status: 400, message: error.message}

        const query = [{email: data.email}]

        const newUser = {first_name: data.firstname, last_name: data.lastname, email: data.email, country: data.country, createdBy: user?._id}

        data.phone_number && (query.push({ phone_number: data.phone_number }), newUser.phone_number = data.phone_number);

        const userExist = await User.findOne({$or: query})

        if (userExist) return {success: false, status: 409, message: `Phone number or email already exist`}

        const savedUser = await new User(newUser).save()

        const userOnboarding = await TokenServices.genereteToken(savedUser, CONFIG.AUTH.TOKEN_TYPES.onboarding)

        await mailerServices.sendOnboardingEmail(savedUser, data?.redirect_url, userOnboarding?.data)

        return {success: true, status: 201, message: `User created successfully`}     

    }


    async onboardUser(body) {

        const {error, value: data} = ValidationSchema.onboardUser.validate(body)
        
        if (error) return {success: false, status: 400, message: error.message}

        const query = [{_id: data.target}]
        
        data.phone_number && (query.push({ phone_number: data.phone_number }), newUser.phone_number = data.phone_number);

        const user = await User.findOne({$or: query})
        
        if (user) return {success: false, status: 409, message: `Phone number or email already exist`}

        const verifyToken = await TokenServices.verifyToken(user, CONFIG.AUTH.TOKEN_TYPES.onboarding, data.code, data.token)

        if (!verifyToken.success) return {success: false, status: verifyToken.status, message: verifyToken.message, issue: verifyToken.issue}

        const hashedPassword = bcrypt.hashSync(data.password, CONFIG.AUTH.BCRYPT_SALT)

        const updates = {first_name: data.firstname, last_name: data.lastname, status: 'active', country: data.country, phone_number: data.phone_number, password: hashedPassword, updatedBy: 'system'}

        data.phone_number && (query.push({ phone_number: data.phone_number }), updates.phone_number = data.phone_number);

        const defaultRole = await Role.findOne({name: 'user'})

        if (!defaultRole) return {success: false, status: 500, message: 'User role not found', issue: '-role_not_found'}
        
        updates.roles = [defaultRole._id]

        const savedUser = await new User.updataOne({_id: data?.target}, {$set: updates})

        await new RoleHistory({user: savedUser._id, role: defaultRole._id, action: 'assign'}).save()

        await mailerServices.sendOnboardingEmail(savedUser)

        return {success: true, status: 201, message: `User onboarded successfully`}     

    }


    async getCurrentUser (user) {

        const userExist = User.findOne({_id: user?._id})

        return {success: true, status: 200, message: 'User fetched successfully', data: {user: userExist}}

    }


    async getAllUser(user, body) {

        const {error, value: data} = ValidationSchema.getAllUser.validate(body)
        
        if (error) return {success: false, status: 400, message: error.message}

        const query = {}  
        
        if (data.first_name) query.first_name = data.firstname

        if (data.last_name) query.last_name = data.lastname

        if (data.email) query.email = data.email

        if (data.status) query.status = data.status

        if (data.role) query.roles = data.role

        if (data.dateCreated) query.createdAt = new Date(data.dateCreated)

        if (data.minDateCreated || data.maxDateCreated) {
    
            if (data.minDateCreated) query.createdAt.$gte = new Date(data.minDateCreated)
    
            if (data.maxDateCreated) query.createdAt.$lte = new Date(data.maxDateCreated)
        
        }
    
        const getUsers = await User.find(query).populate({path: 'roles', populate: {path: 'privileges'}}).populate('position').populate('department')

        return {success: true, status: 200, message: 'User fetched successfully', data: getUsers}

    }


    async updateUser (body, user) {

        const {error, value: data} = ValidationSchema.updateUser.validate(body)

        if (error) return {success: false, status: 400, message: error.message}

        await User.updateOne({_id: user._id}, {$set: {first_name: data.firstname, last_name: data.lastname}})

        const findUser = await User.findOne({_id: user._id})

        return {success: true, status: 200, message: 'User updated successfully', data: {user: findUser}}

    }


    async changePassword (body, user) {

        const {error, value: data} = ValidationSchema.changePassword.validate(body)

        if (error) return {success: false, status: 400, message: error.message}

        const findUser = await User.findOne({_id: user._id}).select('+password')

        const verifyOldPass = await bcrypt.compare(data.old_password, findUser.password)

        if (!verifyOldPass) return {success: false, status: 401, message: "Old password is invalid", issue: '-invalid_credentials'}

        const hashedPassword = bcrypt.hashSync(data.new_password, BCRYPT_SALT)

        await User.updateOne({_id: findUser._id}, {$set: {password: hashedPassword}})

        return {success: true, status: 200, message: 'Password changed successfully'}

    }
    
}

export default new UserServices