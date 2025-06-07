import { APP_STATUSES } from "../constants/AppStatuses.js"
import Privilege from "../models/privilege.model.js"
import Role from "../models/role.model.js"
import countryServices from "./country.services.js"

class EnumServices {
    
    async getEnums () {

        const getPrivileges = await Privilege.find().select('+name +status')

        const getRoles = await Role.find().sort({createdAt: -1}).select('+name +status')

        const getCountries = (await countryServices.getCountries()).data

        return {
            
            success: true, 
            
            status: 200, 
            
            message: 'Enums retrieved successfully',
            
            data: {
                
                app_status: APP_STATUSES,

                countries: getCountries,

                roles: getRoles?.map((item) => ({name: item.name, id: item._id})),

                privileges: getPrivileges?.map((item) => ({name: item.name, id: item._id})),

            }
        
        }

    }
    
}

export default new EnumServices