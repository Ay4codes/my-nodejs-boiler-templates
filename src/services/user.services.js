import bcrypt from 'bcrypt'
import { CONFIG } from '../../config/index.js';
import User from '../models/user.model.js';
import ValidationSchema from '../utils/validators.schema.js';
import TokenServices from './token.services.js';
import mailerServices from './mailer.services.js'
import RoleHistory from '../models/role.history.model.js';
import Role from '../models/role.model.js';
import CustomDate from '../utils/date.js'
import MediaServices from './media.services.js';

class UserServices {

    async seedUsers() {
    
        const usersCount = await User.countDocuments()
    
        if (usersCount === 0) {

            const allRoles = await Role.find({}).select('_id')

            const hashedPassword = bcrypt.hashSync(CONFIG.DEFAULT_ACCOUNT.PASSWORD, CONFIG.AUTH.BCRYPT_SALT)

            const defaultAccount = await new User({
                
                firstName: CONFIG.DEFAULT_ACCOUNT.FIRSTNAME,
                
                lastName: CONFIG.DEFAULT_ACCOUNT.LASTNAME,
                
                email: CONFIG.DEFAULT_ACCOUNT.EMAIL,

                phoneNumber: CONFIG.DEFAULT_ACCOUNT.PHONE,
                
                status: CONFIG.DEFAULT_ACCOUNT.STATUS,
            
                roles: allRoles,
            
                password: hashedPassword,
                
            }).save()

            console.log(defaultAccount)

        }
        
        return {success: true, status: 200, message: 'Users seeded successfully'}
    
    }

    async createUser(user, body) {

        const {error, value: data} = ValidationSchema.createUser.validate(body)
        
        if (error) return {success: false, status: 400, message: error.message}

        const query = [{email: data.email}]

        const newUser = {firstName: data.firstName, lastName: data.lastName, email: data.email, country: data.country, createdBy: user?._id}

        data.phoneNumber && (query.push({ phoneNumber: data.phoneNumber }), newUser.phoneNumber = data.phoneNumber);

        data.sex && (newUser.sex = data.sex);

        const userExist = await User.findOne({$or: query})

        if (userExist) return {success: false, status: 409, message: `Phone number or email already exist`}

        const defaultRole = await Role.findOneAndUpdate({name: 'STAFF'}, {$inc: {usersAdded: 1}})

        if (!defaultRole) return {success: false, status: 500, message: 'Deault roles not found', issue: '-role_not_found'}

        newUser.roles = [defaultRole?._id]

        const savedUser = await new User(newUser).save()

        await new RoleHistory({user: savedUser._id, role: defaultRole._id, action: 'ASSIGN'}).save()

        const userOnboarding = await TokenServices.genereteToken(savedUser, CONFIG.AUTH.TOKEN_TYPES.onboarding)

        await mailerServices.sendOnboardingEmail(savedUser, data?.redirectUrl, userOnboarding?.data)

        return {success: true, status: 201, message: `User created successfully`}     

    }


    async resendOnboardingLink(user, body) {

        const {error, value: data} = ValidationSchema.resendOnboardingUrl.validate(body)

        if (error) return {success: false, status: 400, message: error.message}

        const userExist = await User.findOne({_id: data?.id})

        if (!userExist) return {success: false, status: 404, message: `User does not exist`}

        const userOnboarding = await TokenServices.genereteToken(userExist, CONFIG.AUTH.TOKEN_TYPES.onboarding)

        await mailerServices.sendOnboardingEmail(userExist, data?.redirectUrl, userOnboarding?.data)

        return {success: true, status: 200, message: `Onboarding link resent successfully`}     

    }


    async onboardUser(body) {

        const {error, value: data} = ValidationSchema.onboardUser.validate(body)
        
        if (error) return {success: false, status: 400, message: error.message}

        const hashedPassword = bcrypt.hashSync(data.password, CONFIG.AUTH.BCRYPT_SALT)

        const verifyToken = await TokenServices.verifyToken(CONFIG.AUTH.TOKEN_TYPES.onboarding, data.token)

        if (!verifyToken.success) return {success: false, status: verifyToken.status, message: 'Onboarding url is invalid', issue: verifyToken.issue}

        const user = verifyToken.data?.user

        const updates = {firstName: data.firstName, lastName: data.lastName, status: 'ACTIVE', country: data.country, phoneNumber: data.phoneNumber, password: hashedPassword, updatedBy: 'system'}

        data.phoneNumber && (updates.phoneNumber = data.phoneNumber);

        data.sex && (updates.sex = data.sex);

        const defaultRole = await Role.findOneAndUpdate({name: 'USER'}, {$inc: {usersAdded: 1}})

        if (!defaultRole) return {success: false, status: 500, message: 'Deault roles not found', issue: '-role_not_found'}
        
        const savedUser = await User.findOneAndUpdate({_id: user}, {$set: updates, $addToSet: {roles: defaultRole._id}}, {new: true})

        await new RoleHistory({user: savedUser._id, role: defaultRole._id, action: 'ASSIGN'}).save()

        await mailerServices.sendOnboardedEmail(savedUser)

        return {success: true, status: 201, message: `User onboarded successfully`}     

    }


    async getCurrentUser (user) {

        return {success: true, status: 200, message: 'User fetched successfully', data: {user: user}}

    }


    async getUser(user, id) {

        const {error, value: data} = ValidationSchema.getUser.validate({id})
        
        if (error) return {success: false, status: 400, message: error.message}

        const getUser = await User.findOne({_id: data?.id}).populate('country').populate({path: 'roles', populate: {path: 'privileges'}})

        return {success: true, status: 200, message: 'User fetched successfully', data: getUser}

    }


    async uploadProfileImage(req) {

        const result = await MediaServices.acceptMedia(req, req.file, req.body)

        if (!result.success) return {success: result.success, status: result.status, message: result.message}

        await User.updateOne({_id: req.user?._id}, {$set: {media: result.data?._id}})
        
        return {success: true, status: 200, message: 'Profile image uploaded successfully'}

    }


    async getAllUser(user, body) {

        const {error, value: data} = ValidationSchema.getAllUser.validate(body)
        
        if (error) return {success: false, status: 400, message: error.message}

        const userRole = await Role.findOne({name: 'USER'})

        if (!userRole) return {success: false, status: 500, message: 'Role not found', issue: '-role_not_found'}

        const query = {roles: {$size: 1, $all: [userRole._id]}}
        
        if (data.firstName) query.firstName = data.firstName

        if (data.lastName) query.lastName = data.lastName

        if (data.email) query.email = data.email

        if (data.status) query.status = data.status

        if (data.dateCreated) query.createdAt = {
            
            $gte: CustomDate.getStartOfDay(data.dateCreated),
            
            $lt: CustomDate.getStartOfNextDay(data.dateCreated)
        }

        if (data.minDateCreated || data.maxDateCreated) {

            query.createdAt = query.createdAt || {}
    
            if (data.minDateCreated) query.createdAt.$gte = CustomDate.getStartOfDay(data.minDateCreated);
    
            if (data.maxDateCreated) query.createdAt.$lt = CustomDate.getStartOfNextDay(data.maxDateCreated);
        
        }

        const getUsers = await User.find(query).populate('media').sort({createdAt: -1}).skip(data?.start).limit(data?.limit)

        return {success: true, status: 200, message: 'User fetched successfully', data: getUsers}

    }


    async getAllUserList(user) {

        const userRole = await Role.findOne({name: 'USER'})

        if (!userRole) return {success: false, status: 500, message: 'Role not found', issue: '-role_not_found'}

        const query = {roles: {$size: 1, $all: [userRole._id]}}
    
        const getUsers = await User.find(query).sort({createdAt: -1}).select('firstName lastName status')

        return {success: true, status: 200, message: 'User fetched successfully', data: getUsers}

    }


    async getAllStaffs(user, body) {

        const {error, value: data} = ValidationSchema.getAllStaff.validate(body)
        
        if (error) return {success: false, status: 400, message: error.message}

        const staffRole = await Role.findOne({name: 'STAFF'})

        if (!staffRole) return {success: false, status: 500, message: 'Role not found', issue: '-role_not_found'}

        const query = {roles: {$in: [staffRole._id]}}
        
        if (data.firstName) query.firstName = data.firstName

        if (data.lastName) query.lastName = data.lastName

        if (data.email) query.email = data.email

        if (data.status) query.status = data.status

        if (data.role) query.roles = {$all: [staffRole._id, data.role]};

        if (data.dateCreated) query.createdAt = {
            
            $gte: CustomDate.getStartOfDay(data.dateCreated),
            
            $lt: CustomDate.getStartOfNextDay(data.dateCreated)
        }

        if (data.minDateCreated || data.maxDateCreated) {

            query.createdAt = query.createdAt || {}
    
            if (data.minDateCreated) query.createdAt.$gte = CustomDate.getStartOfDay(data.minDateCreated);
    
            if (data.maxDateCreated) query.createdAt.$lt = CustomDate.getStartOfNextDay(data.maxDateCreated);
        
        }

        const getUsers = await User.find(query).populate('media').sort({createdAt: -1}).skip(data?.start).limit(data?.limit)

        return {success: true, status: 200, message: 'User fetched successfully', data: getUsers}

    }

    
    async getAllStaffList(user) {

        const staffRole = await Role.findOne({name: 'STAFF'})
        
        if (!staffRole) return {success: false, status: 500, message: 'Staff not found', issue: '-role_not_found'}
    
        const getUsers = await User.find({roles: {$in: [staffRole._id]}}).sort({createdAt: -1}).select('firstName lastName status')

        return {success: true, status: 200, message: 'User fetched successfully', data: getUsers}

    }


    async updateUsers (user, body) {

        const {error, value: data} = ValidationSchema.updateUsers.validate(body)

        if (error) return {success: false, status: 400, message: error.message}

        const {id, ...updates} = data

        await User.updateOne({_id: id}, {$set: updates})

        return {success: true, status: 200, message: 'User updated successfully'}

    }


    async updateUser (user, body) {

        const {error, value: data} = ValidationSchema.updateUser.validate(body)

        if (error) return {success: false, status: 400, message: error.message}

        await User.updateOne({_id: user?._id}, {$set: data})

        return {success: true, status: 200, message: 'User updated successfully'}

    }


    async deactivateUser (user, id) {

        const {error, value: data} = ValidationSchema.deactivateUser.validate({id})

        if (error) return {success: false, status: 400, message: error.message}

        await User.updateOne({_id: data?.id}, {$set: {status: 'DEACTIVATED', updatedBy: user?.email}})

        return {success: true, status: 200, message: 'User updated successfully'}

    }


    async deactivateUser (user, id) {

        const {error, value: data} = ValidationSchema.deactivateUser.validate({id})

        if (error) return {success: false, status: 400, message: error.message}

        await User.updateOne({_id: data?.id}, {$set: {status: 'DISABLED', updatedBy: user?.email}})

        return {success: true, status: 200, message: 'User updated successfully'}

    }


    async deactivateUser (user, id) {

        const {error, value: data} = ValidationSchema.deactivateUser.validate({id})

        if (error) return {success: false, status: 400, message: error.message}

        await User.updateOne({_id: data?.id}, {$set: {status: 'INACTIVE', updatedBy: user?.email}})

        return {success: true, status: 200, message: 'User updated successfully'}

    }


    async reactivateUser (user, id) {

        const {error, value: data} = ValidationSchema.reactivateUser.validate({id})

        if (error) return {success: false, status: 400, message: error.message}

        await User.updateOne({_id: data?.id}, {$set: {status: 'ACTIVE', updatedBy: user?.email}})

        return {success: true, status: 200, message: 'User updated successfully'}

    }


    async changePassword (body, user) {

        const {error, value: data} = ValidationSchema.changePassword.validate(body)

        if (error) return {success: false, status: 400, message: error.message}

        const findUser = await User.findOne({_id: user._id}).select('+password')

        const verifyOldPass = await bcrypt.compare(data.oldPassword, findUser.password)

        if (!verifyOldPass) return {success: false, status: 401, message: "Old password is invalid", issue: '-invalid_credentials'}

        const hashedPassword = bcrypt.hashSync(data.newPassword, BCRYPT_SALT)

        await User.updateOne({_id: findUser._id}, {$set: {password: hashedPassword}})

        return {success: true, status: 200, message: 'Password changed successfully'}

    }
    
}

export default new UserServices