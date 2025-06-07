import { PRIVILEGES } from '../constants/Privileges.js'
import Privilege from '../models/privilege.model.js'
import ValidationSchema from '../utils/validators.schema.js'

class PrivilegeServices {
    
    async seedPrivileges() {
        
        const privilegeCount = await Privilege.countDocuments()
        
        if (privilegeCount > 0) return {success: true, status: 200, message: 'Privileges already seeded'}
        
        const privileges = PRIVILEGES.map(({name, description}) => ({name, description, createdBy: 'system', updatedBy: 'system'}))
        
        await Privilege.insertMany(privileges)
        
        return {success: true, status: 200, message: 'Privileges seeded successfully'}
    
    }

    
    async updatePrivilege(user, id, body) {

        const {error, value: data} = ValidationSchema.updatePrivilege.validate({...body, id: id})
    
        if (error) return {success: false, status: 400, message: error.message}
    
        const privilegeExist = await Privilege.findOne({name: data.name})
    
        if (privilegeExist) return {success: false, status: 409, message: 'Privilege already exists'}

        await Privilege.updateOne({name: data?.name}, {$set: {description: data.description, updatedBy: user?.email}})

        return {success: true, status: 200, message: 'Privilege updated successfully'}

    }


    async getPrivilege(user, id) {

        const {error, value: data} = ValidationSchema.updatePrivilege.validate({id})
        
        if (error) return {success: false, status: 400, message: error.message}
    
        const privilege = await Privilege.findOne({_id: data.id})
    
        if (!privilege) return {success: false, status: 404, message: 'Privilege not found'}
    
        return {success: true, status: 200, message: 'Privilege retrieved successfully', data: privilege}
    
    }


    async getAllPrivileges(user, queryParams) {

        const {error, value: data} = ValidationSchema.getAllPrivileges.validate(queryParams)
        
        if (error) return {success: false, status: 400, message: error.message}

        const query = {}
    
        if (data.name) query.name = data.name

        if (data.status) query.status = data.status
    
        const getPrivileges = await Privilege.find(query).sort({createdAt: -1}).skip(data.start).limit(data.limit)
    
        return {success: true, status: 200, message: 'Privileges retrieved successfully', data: getPrivileges}
    
    }
    
    
}

export default new PrivilegeServices