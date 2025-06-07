import Joi from 'joi'
import mongoose from 'mongoose'
import { APP_STATUSES } from '../constants/AppStatuses.js';

class ValidationSchema {

    constructor() {

        this.register = Joi.object({

            firstname: Joi.string().min(3).max(30).required().label('first name'),

            lastname: Joi.string().min(3).max(30).required().label('last name'),

            country: Joi.string().hex().length(24).optional(),

            email: Joi.string().email().required().label('email'),

            phone_number: Joi.string().min(6).max(15).label('phone number'),

            password: Joi.string().min(8).required().label('password').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).message('Password must contain at least one lowercase letter, one uppercase letter, and one digit')

        });

        this.login = Joi.object({

            email: Joi.string().email().required().label('email'),

            password: Joi.string().min(8).required().label('password').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).message('Password must contain at least one lowercase letter, one uppercase letter, and one digit')

        })

        this.logout = Joi.object({

            refresh_token: Joi.string().required().label('refresh token')

        })

        this.verifyEmail = Joi.object({

            user: Joi.string().required().hex().length(24),

            code: Joi.string().required().min(6).max(6).label('Code'),

            token: Joi.string().label('Token'),

        })

        this.requestPasswordReset = Joi.object({

            redirect_url: Joi.string().uri().required().label('redirect URL'),

            email: Joi.string().email().required().label('email')

        })

        this.resetPassword = Joi.object({

            email: Joi.string().email().required().label('email'),

            code: Joi.string().required().min(6).max(6).label('code'),

            token: Joi.string().required().label('token'),

            new_password: Joi.string().required().min(8).label('new_password').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).message('Password must contain at least one lowercase letter, one uppercase letter, and one digit')

        })

        this.getUser = Joi.object({

            user_id: Joi.string().required().label('User ID')

            .custom((value, helpers) => {
                
                if (mongoose.Types.ObjectId.isValid(value)) return value;
                  
                return helpers.error('any.invalid');
                
            })

            .message("User ID is invalid"),

        })


        this.createUser = Joi.object({

            firstname: Joi.string().min(3).max(30).required().label('first name'),

            lastname: Joi.string().min(3).max(30).required().label('last name'),

            country: Joi.string().hex().length(24).optional(),

            email: Joi.string().email().required().label('email'),

            phone_number: Joi.string().min(6).max(15).label('phone number'),

            redirect_url: Joi.string().uri().required().label('redirect url')

        });


        this.onboardUser = Joi.object({

            firstname: Joi.string().min(3).max(30).required().label('first name'),

            lastname: Joi.string().min(3).max(30).required().label('last name'),

            country: Joi.string().hex().length(24).required().label('country'),
            
            phone_number: Joi.string().min(6).max(15).label('phone number'),

            password: Joi.string().min(8).required().label('password').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).message('Password must contain at least one lowercase letter, one uppercase letter, and one digit'),

            target: Joi.string().hex().length(24).required().label('target'),

            code: Joi.string().required().label('code'),

            token: Joi.string().required().label('token')

        });


        this.getAllUser = Joi.object({

            firstname: Joi.string().min(3).max(30).label('first name').optional(),

            lastname: Joi.string().min(3).max(30).label('last name').optional(),

            email: Joi.string().optional(),
            
            status: Joi.string().optional().valid(...APP_STATUSES),
            
            role: Joi.string().hex().length(24).optional(),
            
            position: Joi.string().hex().length(24).optional(),
            
            department: Joi.string().hex().length(24).optional(),

            dateCreated: Joi.string().isoDate().optional(),

            minDateCreated: Joi.string().isoDate().optional(),

            maxDateCreated: Joi.string().isoDate().optional(),

        })

        
        this.updateUser = Joi.object({

            firstname: Joi.string().min(3).max(30).required().label('first name'),

            lastname: Joi.string().min(3).max(30).required().label('last name'),

            phone_number: Joi.string().min(3).max(30).required().label('phone number'),

        }).min(1)

        
        this.changePassword = Joi.object({

            old_password: Joi.string().required().min(8).label('old_password').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).message('Password must contain at least one lowercase letter, one uppercase letter, and one digit'),

            new_password: Joi.string().required().min(8).label('new_password').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).message('Password must contain at least one lowercase letter, one uppercase letter, and one digit')

        })

        
        this.createPrivilege = Joi.object({

            name: Joi.string().lowercase().required(),

            description: Joi.string().required(),

        })

        
        this.updatePrivilege = Joi.object({

            id: Joi.string().hex().length(24).required(),

            description: Joi.string().required(),

        })

        
        this.getPrivilege = Joi.object({

            id: Joi.string().hex().length(24).required(),

        })

        
        this.getAllPrivileges = Joi.object({

            name: Joi.string().lowercase().optional(),

            status: Joi.string().optional().valid(...APP_STATUSES),

            start: Joi.number().required().min(0).default(0),

            limit: Joi.number().required().min(1).max(30).required(),

        })

        
        this.createRole = Joi.object({
            
            name: Joi.string().lowercase().required().min(3).max(50).messages({
            
                'string.pattern.base': 'Name must contain only lowercase letters and underscores',
            
                'string.min': 'Name must be at least 3 characters long',
            
                'string.max': 'Name must not exceed 50 characters'
            
            }),
            
            description: Joi.string().required().min(10).max(200),
            
            privileges: Joi.array().items(Joi.string().hex().length(24)).optional()
        
        }),
        
        
        this.updateRole = Joi.object({
        
            id: Joi.string().required().label('id').hex().length(24),
        
            description: Joi.string().min(10).max(200).optional(),
        
            privileges: Joi.array().items(Joi.string().hex().length(24)).optional()
        
        }),
        
        
        this.assignRole = Joi.object({
        
            user: Joi.string().hex().length(24).required(),
        
            role: Joi.string().hex().length(24).required()
        
        }),
        
        
        this.getRole = Joi.object({
        
            id: Joi.string().hex().length(24).required()
        
        }),
        
        
        this.getAllRoles = Joi.object({

            name: Joi.string().lowercase().optional(),

            status: Joi.string().lowercase().optional().valid(...APP_STATUSES),

            dateCreated: Joi.string().isoDate().optional(),

            minDateCreated: Joi.string().isoDate().optional(),

            maxDateCreated: Joi.string().isoDate().optional(),

            start: Joi.number().required().min(0).default(0),
        
            limit: Joi.number().required().min(1).max(30).default(10)
        
        })


        this.getAllRoleHistory = Joi.object({

            start: Joi.number().required().min(0).default(0),
        
            limit: Joi.number().required().min(1).max(30).default(10)
        
        })
    
    }

}

export default new ValidationSchema