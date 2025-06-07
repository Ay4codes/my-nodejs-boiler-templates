import { APP_STATUSES } from "../constants/AppStatuses.js"
import Privilege from "../models/privilege.model.js"
import Role from "../models/role.model.js"

class EnumServices {
    
    async getEnums () {

        const getPrivileges = await Privilege.find().sort({createdAt: -1}).select('+name +status')

        const getRoles = await Role.find().sort({createdAt: -1}).select('+name +status')

        return {
            
            success: true, 
            
            status: 200, 
            
            message: 'Enums retrieved successfully',
            
            data: {
                
                app_status: APP_STATUSES,

                roles: getRoles,

                privileges: getPrivileges,

            }
        
        }

    }
    
}

export default new EnumServices