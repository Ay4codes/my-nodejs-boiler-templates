import Joi from 'joi'
import mongoose from 'mongoose'
import { APP_STATUSES } from '../constants/AppStatuses.js';

class ValidationSchema {

    constructor() {

        this.register = Joi.object({

            firstName: Joi.string().min(3).max(30).required().label('first name'),

            lastName: Joi.string().min(3).max(30).required().label('last name'),

            country: Joi.string().hex().length(24).optional(),

            email: Joi.string().email().required().label('email'),

            sex: Joi.string().label('sex'),

            phoneNumber: Joi.string().min(6).max(15).label('phone number'),

            password: Joi.string().min(8).required().label('password').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).message('Password must contain at least one lowercase letter, one uppercase letter, and one digit'),

            redirectUrl: Joi.string().uri().required().label('redirect URL'),

        });

        this.login = Joi.object({

            email: Joi.string().email().required().label('email'),

            password: Joi.string().min(8).required().label('password').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).message('Password must contain at least one lowercase letter, one uppercase letter, and one digit'),

            redirectUrl: Joi.string().uri().required().label('redirect URL')

        })

        this.logout = Joi.object({

            refreshToken: Joi.string().required().label('refresh token')

        })

        this.verifyEmail = Joi.object({

            token: Joi.string().label('Token'),

        })

        this.requestPasswordReset = Joi.object({

            redirectUrl: Joi.string().uri().required().label('redirect URL'),

            email: Joi.string().email().required().label('email')

        })

        this.resetPassword = Joi.object({

            token: Joi.string().required().label('token'),

            newPassword: Joi.string().required().min(8).label('newPassword').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).message('Password must contain at least one lowercase letter, one uppercase letter, and one digit')

        })


        this.createUser = Joi.object({

            firstName: Joi.string().min(3).max(30).required().label('first name'),

            lastName: Joi.string().min(3).max(30).required().label('last name'),

            country: Joi.string().hex().length(24).optional(),

            email: Joi.string().email().required().label('email'),

            sex: Joi.string().label('sex'),

            phoneNumber: Joi.string().min(6).max(15).label('phone number'),

            redirectUrl: Joi.string().uri().required().label('redirect url')

        });


        this.resendOnboardingUrl = Joi.object({

            id: Joi.string().hex().length(24).optional(),

            redirectUrl: Joi.string().uri().required().label('redirect url')

        });


        this.onboardUser = Joi.object({

            firstName: Joi.string().min(3).max(30).required().label('first name'),

            lastName: Joi.string().min(3).max(30).required().label('last name'),

            country: Joi.string().hex().length(24).required().label('country'),
            
            phoneNumber: Joi.string().min(6).max(15).label('phone number'),

            sex: Joi.string().label('sex'),

            password: Joi.string().min(8).required().label('password').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).message('Password must contain at least one lowercase letter, one uppercase letter, and one digit'),

            token: Joi.string().required().label('token')

        });


        this.getUser = Joi.object({

            id: Joi.string().hex().length(24).required(),

        })

        this.getById = Joi.object({

            id: Joi.string().hex().length(24).required(),

        })

        this.deleteById = Joi.object({

            id: Joi.string().hex().length(24).required(),

        })


        this.updateMedia = Joi.object({

            id: Joi.string().hex().length(24).required(),

        })


        this.getAllUser = Joi.object({

            firstName: Joi.string().label('first name').optional(),

            lastName: Joi.string().label('last name').optional(),

            email: Joi.string().optional(),
            
            status: Joi.string().optional().valid(...APP_STATUSES),
            
            position: Joi.string().hex().length(24).optional(),
            
            department: Joi.string().hex().length(24).optional(),

            dateCreated: Joi.string().isoDate().optional(),

            minDateCreated: Joi.string().isoDate().optional(),

            maxDateCreated: Joi.string().isoDate().optional(),

            start: Joi.number().required().min(0).default(0),

            limit: Joi.number().required().min(1).max(30).required(),

        })


        this.getAllStaff = Joi.object({

            firstName: Joi.string().label('first name').optional(),

            lastName: Joi.string().label('last name').optional(),

            email: Joi.string().optional(),
            
            status: Joi.string().optional().valid(...APP_STATUSES),
            
            role: Joi.string().hex().length(24).optional(),
            
            position: Joi.string().hex().length(24).optional(),
            
            department: Joi.string().hex().length(24).optional(),

            dateCreated: Joi.string().isoDate().optional(),

            minDateCreated: Joi.string().isoDate().optional(),

            maxDateCreated: Joi.string().isoDate().optional(),

            start: Joi.number().required().min(0).default(0),

            limit: Joi.number().required().min(1).max(30).required(),

        })

        
        this.updateUsers = Joi.object({

            id: Joi.string().hex().length(24).required(),

            firstName: Joi.string().min(3).max(30).optional().label('first name'),

            lastName: Joi.string().min(3).max(30).optional().label('last name'),

            sex: Joi.string().optional().label('sex'),

            country: Joi.string().hex().length(24).optional(),

            phoneNumber: Joi.string().min(6).max(15).optional().label('phone number'),

        })


        this.updateUser = Joi.object({

            firstName: Joi.string().min(3).max(30).optional().label('first name'),

            lastName: Joi.string().min(3).max(30).optional().label('last name'),

            sex: Joi.string().optional().label('sex'),

            country: Joi.string().hex().length(24).optional(),

            phoneNumber: Joi.string().min(6).max(15).optional().label('phone number'),

        })


        this.deactivateUser = Joi.object({

            id: Joi.string().hex().length(24).required(),

        })
        

        this.reactivateUser = Joi.object({

            id: Joi.string().hex().length(24).required(),

        })

        
        this.changePassword = Joi.object({

            oldPassword: Joi.string().required().min(8).label('oldPassword').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).message('Password must contain at least one lowercase letter, one uppercase letter, and one digit'),

            newPassword: Joi.string().required().min(8).label('newPassword').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).message('Password must contain at least one lowercase letter, one uppercase letter, and one digit')

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


        this.updateModule = Joi.object({

            id: Joi.string().hex().length(24).required(),

            description: Joi.string().required(),

        })

        
        this.getModule = Joi.object({

            id: Joi.string().hex().length(24).required(),

        })

        
        this.getAllModule = Joi.object({

            name: Joi.string().lowercase().optional(),

            status: Joi.string().optional().valid(...APP_STATUSES),

            start: Joi.number().required().min(0).default(0),

            limit: Joi.number().required().min(1).max(30).required(),

        })

        
        this.createRole = Joi.object({
            
            name: Joi.string().uppercase().required().min(3).max(50).messages({
            
                'string.pattern.base': 'Name must contain only uppercase letters and underscores',
            
                'string.min': 'Name must be at least 3 characters long',
            
                'string.max': 'Name must not exceed 50 characters'
            
            }),
            
            description: Joi.string().required().min(10).max(200),
            
            privileges: Joi.array().items(Joi.string().hex().length(24)).min(1),

            modules: Joi.array().items(Joi.string().hex().length(24)).min(1),
        
        }),
        
        
        this.updateRole = Joi.object({
        
            id: Joi.string().required().label('id').hex().length(24),

            name: Joi.string().uppercase().required().min(3).max(50).messages({
            
                'string.pattern.base': 'Name must contain only uppercase letters and underscores',
            
                'string.min': 'Name must be at least 3 characters long',
            
                'string.max': 'Name must not exceed 50 characters'
            
            }),
        
            description: Joi.string().min(10).max(200).required(),
        
            privileges: Joi.array().items(Joi.string().hex().length(24)).min(1),

            modules: Joi.array().items(Joi.string().hex().length(24)).min(1),
        
        }),

        this.assignRole = Joi.object({
        
            userIds: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
        
            roleId: Joi.string().hex().length(24).required()
        
        }),
        
        
        this.removeRole = Joi.object({
        
            userId: Joi.string().hex().length(24).required(),
        
            roleId: Joi.string().hex().length(24).required()
        
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

            user: Joi.string().hex().length(24).required(),

        })


        this.getRoleMembers = Joi.object({
            
            roleId: Joi.string().hex().length(24).optional(),

        })

        this.uploadMedia = Joi.object({

            name: Joi.string().uppercase().optional(),

            downloadAccess: Joi.boolean().default(false),
    
            description: Joi.string().allow('').optional()

        })

        this.deleteMedia = Joi.object({

            id: Joi.string().hex().length(24).required(),

        })

        this.getAllMedia = Joi.object({

            name: Joi.string().lowercase().optional(),

            status: Joi.string().optional().valid(...APP_STATUSES),

            dateCreated: Joi.string().isoDate().optional(),

            minDateCreated: Joi.string().isoDate().optional(),

            maxDateCreated: Joi.string().isoDate().optional(),

            start: Joi.number().required().min(0).default(0),

            limit: Joi.number().required().min(1).max(30).required(),

        })


        this.updateMedia = Joi.object({

            id: Joi.string().hex().length(24).required(),

            name: Joi.string().required()

        })


        this.contactUser = Joi.object({

            receiver: Joi.string().hex().length(24).required(),

            subject: Joi.string().required(),

            content: Joi.string().required(),

        })
    
    }

}

export default new ValidationSchema