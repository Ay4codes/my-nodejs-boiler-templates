import { APP_STATUSES } from "../constants/AppStatuses.js"

class EnumServices {
    
    async getEnums () {

        return {
            
            success: true, 
            
            status: 200, 
            
            message: 'Enums retrieved successfully',
            
            data: {
                
                AppStatus: APP_STATUSES,

                Sex: ['MALE', 'FEMALE', 'OTHERS']

            }
        
        }

    }
    
}

export default new EnumServices