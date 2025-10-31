import Role from '../models/role.model.js'
import Privilege from '../models/privilege.model.js'
import User from '../models/user.model.js'
import ValidationSchema from '../utils/validators.schema.js'
import RoleHistory from '../models/role.history.model.js'
import Module from '../models/modules.model.js'
import { DEFAULT_PRIVILEGES } from '../constants/Privileges.js'
import { SEED_USER_APPLICATION_MODULES } from '../constants/ApplicationModules.js'
import Modules from '../models/modules.model.js'

class RoleServices {

    async seedRoles() {

        const roleCount = await Role.countDocuments()

        const allPrivileges = await Privilege.find({}).select('_id')

        const allModules = await Module.find({}).select('_id')
        
        if (roleCount > 0) {

            await Role.updateOne({name: 'SUPER_ADMIN'}, {$set: {privileges: allPrivileges.map(p => p._id), modules: allModules.map(p => p._id)}})

            return {success: true, status: 200, message: 'Roles already seeded'}
        
        }

        if (allPrivileges.length === 0) return {success: false, status: 400, message: 'No privileges found for seeding roles'}
        
        const userPrivileges = await Privilege.find({name: {$in: DEFAULT_PRIVILEGES}}).select('_id')

        const userModules = await Module.find({name: {$in: SEED_USER_APPLICATION_MODULES}}).select('_id')
        
        if (userPrivileges.length === 0) return {success: false, status: 400, message: 'Required user privileges not found'}
        
        const roles = [
                        
            {name: 'USER', description: 'Standard user access', usersAdded: 1, createdBy: 'system', updatedBy: 'system', privileges: userPrivileges.map(p => p._id), modules: userModules.map(p => p._id)},

            {name: 'STAFF', description: 'Standard staff access', usersAdded: 1, createdBy: 'system', updatedBy: 'system', privileges: userPrivileges.map(p => p._id), modules: userModules.map(p => p._id)},

            {name: 'SUPER_ADMIN', description: 'Full system access', usersAdded: 1, createdBy: 'system', updatedBy: 'system', privileges: allPrivileges.map(p => p._id), modules: allModules.map(p => p._id)},
        
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
        
        const newRole = {name: data.name, description: data.description, privileges: data.privileges || [], modules: data.modules || [], createdBy: user._id, updatedBy: user._id}
        
        const role = await new Role(newRole).save()
        
        return {success: true, status: 201, message: 'Role created successfully', data: role}
    
    }

    
    async updateRole(user, body) {
    
        const {error, value: data} = ValidationSchema.updateRole.validate({...body})
    
        if (error) return {success: false, status: 400, message: error.message}
    
        const role = await Role.findById(data.id)
    
        if (!role) return {success: false, status: 404, message: 'Role not found'}
    
        if (data.privileges && data.privileges.length > 0) {
    
            const privilegesExist = await Privilege.find({_id: {$in: data.privileges}})
    
            if (privilegesExist.length !== data.privileges.length) return {success: false, status: 400, message: 'One or more privileges do not exist'}
    
        }

        if (data.modules && data.modules.length > 0) {
    
            const modulesExist = await Modules.find({_id: {$in: data.modules}})
    
            if (modulesExist.length !== data.modules.length) return {success: false, status: 400, message: 'One or more modules do not exist'}
    
        }
    
        const updateData = {name: data.name || role.name, description: data.description || role.description, privileges: data.privileges || role.privileges, modules: data.modules || role.modules, updatedBy: user._id}
    
        const updatedRole = await Role.findByIdAndUpdate(data.id, {$set: updateData}, {new: true})
    
        return {success: true, status: 200, message: 'Role updated successfully', data: updatedRole}
    
    }

    
    async assignRoleToUser(user, body) {
        
        const {error, value: data} = ValidationSchema.assignRole.validate(body)
        
        if (error) return {success: false, status: 400, message: error.message}

        const roleIdString = data.roleId.toString();
        
        const successfulAssignments = [];
    
        const failedAssignments = [];

        const targetUsers = await User.find({ _id: { $in: data.userIds } });

        for (const userId of data.userIds) {
            
            const targetUser = targetUsers.find(u => u._id.toString() === userId);

            if (!targetUser) {
                
                failedAssignments.push({ userId, message: 'User not found' });
                
                continue;
            
            }

            if (targetUser.roles.map(r => r.toString()).includes(roleIdString)) {
            
                failedAssignments.push({ userId, message: 'User already has this role' });
            
                continue;
            
            }

            successfulAssignments.push(userId);
        
        }

        if (successfulAssignments.length === 0) return {success: false, status: 400, message: failedAssignments.map(f => f.message).join('; ') || 'No valid users to assign role to'}

        await Role.updateOne({_id: data.roleId}, {$inc: {usersAdded: successfulAssignments.length}})

        await User.updateMany({ _id: { $in: successfulAssignments } }, { $push: { roles: data.roleId }, $set: { updatedBy: user._id } });
    
        const historyEntries = successfulAssignments.map(userId => ({user: userId, role: data.roleId, action: 'ASSIGN'}));

        await RoleHistory.insertMany(historyEntries);

        await RoleHistory.insertMany(historyEntries);

        await User.find({ _id: {$in: successfulAssignments }}).populate({ path: 'roles', populate: { path: 'privileges' } });

        let message = `Role assigned to ${successfulAssignments.length} user(s) successfully.`;

        if (failedAssignments.length > 0) message += ` ${failedAssignments.length} user(s) failed assignment.`;
    
        return {success: true, status: 200, message: message}

    }

    async removeRoleFromUser(user, body) {
        
        const {error, value: data} = ValidationSchema.removeRole.validate(body)
        
        if (error) return {success: false, status: 400, message: error.message}

        const targetUser = await User.findById(data.userId)

        if (!targetUser) return {success: false, status: 404, message: 'User not found'}

        const role = await Role.findById(data.roleId)

        if (!role) return {success: false, status: 404, message: 'Role not found'}

        if (role.name === 'USER') return {success: false, status: 403, message: 'Users cannot be explicitly removed from the default USER role.'}

        if (role.name === 'SUPER_ADMIN' && targetUser?.createdBy === 'system') return {success: false, status: 403, message: 'The default SUPER ADMIN user cannot be removed from the SUPER ADMIN role.'}

        if (!targetUser.roles.includes(data.roleId)) return {success: false, status: 400, message: 'User does not have this role'}

        await Role.updateOne({_id: data.roleId}, {$inc: {usersAdded: -1}})

        await User.updateOne({_id: data.userId}, {$pull: {roles: data.roleId}, $set: {updatedBy: user._id}})

        await new RoleHistory({user: data.userId, role: data.roleId, action: 'REMOVE'}).save()

        const updatedUser = await User.findById(data.userId).populate({path: 'roles', populate: {path: 'privileges'}})
    
        return {success: true, status: 200, message: 'Role removed from user successfully', data: updatedUser}
    
    }

    
    async getRole(user, id) {
    
        const {error, value: data} = ValidationSchema.getRole.validate({id})
    
        if (error) return {success: false, status: 400, message: error.message}
    
        const role = await Role.findById(data.id).populate('privileges').populate('modules').select('+privileges +modules')
    
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

        const roles = await Role.find(query).populate({path: 'privileges', select: '+privileges +modules'}).sort({createdAt: -1}).skip(data.start).limit(data.limit)
        
        return {success: true, status: 200, message: 'Roles retrieved successfully', data: roles}
    
    }


    async getMembers(user, roleId) {

        const {error, value: data} = ValidationSchema.getRoleMembers.validate({roleId})
        
        if (error) return {success: false, status: 400, message: error.message}

        const getMembers = await User.find({roles: data.roleId}).sort({createdAt: -1})

        return {success: true, status: 200, message: 'Members fetched successfully', data: getMembers}

    }


    async getAllRolesList(user) {
    
        const roles = await Role.find({status: 'ACTIVE'}).populate({path: 'privileges', select: '+privileges +modules'}).sort({createdAt: -1}).lean()
        
        return {success: true, status: 200, message: 'Roles retrieved successfully', data: roles}
    
    }


    async getRoleHistory(user, queryParams) {
        
        const {error, value: data} = ValidationSchema.getAllRoleHistory.validate(queryParams)
        
        if (error) return {success: false, status: 400, message: error.message}
        
        const history = await RoleHistory.find({user: data.user}).populate('user', 'firstName lastName email').populate({path: 'role', populate: {path: 'privileges', select: '+privileges +modules'}}).sort({createdAt: -1})

        return {success: true, status: 200, message: 'Role history retrieved successfully', data: history}
    
    }

    
    async deleteRole(user, body) {
    
        const {error, value: data} = ValidationSchema.getRole.validate(body)
    
        if (error) return {success: false, status: 400, message: error.message}
    
        const role = await Role.findById(data.id)
    
        if (!role) return {success: false, status: 404, message: 'Role not found'}

        if (role.name === 'USER' || role.name === "SUPER_ADMIN" || role.name === 'STAFF') return {success: false, status: 409, message: 'Default roles cannot be deleted'}
    
        const usersWithRole = await User.find({roles: data.id}).limit(1)
    
        if (usersWithRole.length > 0) return {success: false, status: 400, message: 'Cannot delete role assigned to users'}
    
        await Role.findByIdAndDelete(data.id)
    
        return {success: true, status: 200, message: 'Role deleted successfully'}
    
    }

}

export default new RoleServices