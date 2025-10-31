import { APPLICATION_MODULES } from '../constants/ApplicationModules.js'
import Module from '../models/modules.model.js'
import ValidationSchema from '../utils/validators.schema.js'

class ModuleServices {
    
    async seedModules() {
     
        const existingModules = await Module.find({}, 'name').lean()
     
        const existingNames = existingModules.map(p => p.name)
     
        const newModules = APPLICATION_MODULES.filter(p => !existingNames.includes(p.name)).map(({name, description}) => ({name, description, status: "ACTIVE", createdBy: 'system', updatedBy: 'system'}))
        
        if (newModules.length === 0) return {success: true, status: 200, message: 'No new privileges to seed'}
        
        await Module.insertMany(newModules)
        
        return {success: true, status: 200, message: 'Modules seeded successfully'}
    
    }

    
    async updateModule(user, id, body) {

        const {error, value: data} = ValidationSchema.updateModule.validate({...body, id: id})
    
        if (error) return {success: false, status: 400, message: error.message}
    
        const privilegeExist = await Module.findOne({name: data.name})
    
        if (privilegeExist) return {success: false, status: 409, message: 'Module already exists'}

        await Module.updateOne({name: data?.name}, {$set: {description: data.description, updatedBy: user?.email}})

        return {success: true, status: 200, message: 'Module updated successfully'}

    }


    async getModule(user, id) {

        const {error, value: data} = ValidationSchema.getModule.validate({id})
        
        if (error) return {success: false, status: 400, message: error.message}
    
        const privilege = await Module.findOne({_id: data.id})
    
        if (!privilege) return {success: false, status: 404, message: 'Module not found'}
    
        return {success: true, status: 200, message: 'Module retrieved successfully', data: privilege}
    
    }


    async getAllModules(user, queryParams) {

        const {error, value: data} = ValidationSchema.getAllModule.validate(queryParams)
        
        if (error) return {success: false, status: 400, message: error.message}

        const query = {}
    
        if (data.name) query.name = data.name

        if (data.status) query.status = data.status
    
        const getModules = await Module.find(query).sort({createdAt: -1}).skip(data.start).limit(data.limit)
    
        return {success: true, status: 200, message: 'Modules retrieved successfully', data: getModules}
    
    }


    async getAllModulesList(user) {

        const getModules = await Module.find({status: 'ACTIVE'}).sort({createdAt: -1}).lean()
    
        return {success: true, status: 200, message: 'Modules retrieved successfully', data: getModules}
    
    }
    
    
}

export default new ModuleServices