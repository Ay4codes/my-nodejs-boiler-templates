import Role from '../models/role.model.js'
import Privilege from '../models/privilege.model.js'
import User from '../models/user.model.js'
import ValidationSchema from '../utils/validators.schema.js'
import RoleHistory from '../models/role.history.model.js'

class RoleServices {

    async seedRoles() {

        const roleCount = await Role.countDocuments()
        
        if (roleCount > 0) return {success: true, status: 200, message: 'Roles already seeded'}
        
        const allPrivileges = await Privilege.find({}).select('_id')
        
        if (allPrivileges.length === 0) return {success: false, status: 400, message: 'No privileges found for seeding roles'}
        
        const userPrivileges = await Privilege.find({name: {$in: ['view_user', 'update_user', 'reset_password', 'verify_email', 'change_password', 'onboard_user']}}).select('_id')
        
        if (userPrivileges.length === 0) return {success: false, status: 400, message: 'Required user privileges not found'}
        
        const roles = [
            
            {name: 'super_admin', description: 'Full system access', createdBy: 'system', updatedBy: 'system', privileges: allPrivileges.map(p => p._id)},
            
            {name: 'user', description: 'Standard user access', createdBy: 'system', updatedBy: 'system', privileges: userPrivileges.map(p => p._id)}
        
        ]
        
        await Role.insertMany(roles)
        
        return {success: true, status: 200, message: 'Roles seeded successfully'}
    
    }
    
    async createRole(user, body) {
        
        const {error, value: data} = ValidationSchema.createRole.validate(body)
        
        if (error) return {success: false, status: 400, message: error.message}
        
        const roleExist = await Role.findOne({name: data.name})
        
        if (roleExist) return {success: false, status: 409, message: 'Role already exists'}
        
        if (data.privileges && data.privileges.length > 0) {
        
            const privilegesExist = await Privilege.find({_id: {$in: data.privileges}})
        
            if (privilegesExist.length !== data.privileges.length) return {success: false, status: 400, message: 'One or more privileges do not exist'}
        
        }
        
        const newRole = {name: data.name, description: data.description, privileges: data.privileges || [], createdBy: user._id, updatedBy: user._id}
        
        const role = await new Role(newRole).save()
        
        return {success: true, status: 201, message: 'Role created successfully', data: role}
    
    }

    
    async updateRole(user, id, body) {
    
        const {error, value: data} = ValidationSchema.updateRole.validate({...body, id: id})
    
        if (error) return {success: false, status: 400, message: error.message}
    
        const role = await Role.findById(data.id)
    
        if (!role) return {success: false, status: 404, message: 'Role not found'}
    
        if (data.privileges && data.privileges.length > 0) {
    
            const privilegesExist = await Privilege.find({_id: {$in: data.privileges}})
    
            if (privilegesExist.length !== data.privileges.length) return {success: false, status: 400, message: 'One or more privileges do not exist'}
    
        }
    
        const updateData = {description: data.description || role.description, privileges: data.privileges || role.privileges, updatedBy: user._id}
    
        const updatedRole = await Role.findByIdAndUpdate(data.id, {$set: updateData}, {new: true})
    
        return {success: true, status: 200, message: 'Role updated successfully', data: updatedRole}
    
    }

    
    async assignRoleToUser(user, body) {
        
        const {error, value: data} = ValidationSchema.assignRole.validate(body)
        
        if (error) return {success: false, status: 400, message: error.message}

        const targetUser = await User.findById(data.user)
        
        if (!targetUser) return {success: false, status: 404, message: 'User not found'}

        const role = await Role.findById(data.role)
        
        if (!role) return {success: false, status: 404, message: 'Role not found'}

        if (targetUser.roles.includes(data.role)) return {success: false, status: 400, message: 'User already has this role'}

        await User.updateOne({_id: data.user}, {$push: {roles: data.role}, $set: {updatedBy: user._id}})

        await new RoleHistory({user: data.user, role: data.role, action: 'assign'}).save()

        const updatedUser = await User.findById(data.user).populate({path: 'roles', populate: {path: 'privileges'}})
    
        return {success: true, status: 200, message: 'Role assigned to user successfully', data: updatedUser}
    
    }

    async removeRoleFromUser(user, body) {
        
        const {error, value: data} = ValidationSchema.assignRole.validate(body)
        
        if (error) return {success: false, status: 400, message: error.message}

        const targetUser = await User.findById(data.user)

        if (!targetUser) return {success: false, status: 404, message: 'User not found'}

        const role = await Role.findById(data.role)

        if (!role) return {success: false, status: 404, message: 'Role not found'}

        if (!targetUser.roles.includes(data.role)) return {success: false, status: 400, message: 'User does not have this role'}

        await User.updateOne({_id: data.user}, {$pull: {roles: data.role}, $set: {updatedBy: user._id}})

        await new RoleHistory({user: data.user, role: data.role, action: 'remove'}).save()

        const updatedUser = await User.findById(data.user).populate({path: 'roles', populate: {path: 'privileges'}})
    
        return {success: true, status: 200, message: 'Role removed from user successfully', data: updatedUser}
    
    }

    
    async getRole(user, id) {
    
        const {error, value: data} = ValidationSchema.getRole.validate({id})
    
        if (error) return {success: false, status: 400, message: error.message}
    
        const role = await Role.findById(data.id).populate({path: 'privileges', select: 'privileges'})
    
        if (!role) return {success: false, status: 404, message: 'Role not found'}
    
        return {success: true, status: 200, message: 'Role retrieved successfully', data: role}
    
    }

    
    async getAllRoles(user, queryParams) {
    
        const {error, value: data} = ValidationSchema.getAllRoles.validate(queryParams)
    
        if (error) return {success: false, status: 400, message: error.message}
    
        const query = {}
    
        if (data.name) query.name = data.name

        if (data.status) query.status = data.status

        if (data.minDateCreated || data.maxDateCreated) {
    
            if (data.minDateCreated) query.createdAt.$gte = new Date(data.minDateCreated)
    
            if (data.maxDateCreated) query.createdAt.$lte = new Date(data.maxDateCreated)
        
        }

        const roles = await Role.find(query).populate({path: 'privileges', select: 'privileges'}).sort({createdAt: -1}).skip(data.start).limit(data.limit)
        
        return {success: true, status: 200, message: 'Roles retrieved successfully', data: roles}
    
    }

    async getRoleHistory(user, queryParams) {
        
        const {error, value: data} = ValidationSchema.getAllRoleHistory.validate(queryParams)
        
        if (error) return {success: false, status: 400, message: error.message}
        
        const query = {user: data.user}
        
        const history = await RoleHistory.find(query).populate('user', 'first_name last_name email').populate({path: 'role', populate: {path: 'privileges', select: 'privileges'}}).populate('updatedBy', 'first_name last_name email').sort({createdAt: -1}).skip(data.start).limit(data.limit)

        return {success: true, status: 200, message: 'Role history retrieved successfully', data: history}
    
    }

    
    async deleteRole(user, body) {
    
        const {error, value: data} = ValidationSchema.getRole.validate(body)
    
        if (error) return {success: false, status: 400, message: error.message}
    
        const role = await Role.findById(data.id)
    
        if (!role) return {success: false, status: 404, message: 'Role not found'}
    
        const usersWithRole = await User.find({roles: data.id}).limit(1)
    
        if (usersWithRole.length > 0) return {success: false, status: 400, message: 'Cannot delete role assigned to users'}
    
        await Role.findByIdAndDelete(data.id)
    
        return {success: true, status: 200, message: 'Role deleted successfully'}
    
    }

}

export default new RoleServices