const Joi = require('joi');
const { auth } = require('../../config');

class ValidationSchema {

    constructor() {

        this.register = Joi.object({

            firstname: Joi.string().min(3).max(30).required().label('first name'),

            lastname: Joi.string().min(3).max(30).required().label('last name'),

            email: Joi.string().email().required().label('email'),

            phone_number: Joi.string().min(6).max(15).label('phone number'),

            country: Joi.string().label('country'),

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

            user_id: Joi.string().required().label('User ID').regex(/^[0-9a-fA-F]{24}$/).message("User ID is invalid"),

            code: Joi.string().required().min(6).max(6).label('Code'),

            token: Joi.string().label('Token'),

            with_identity: Joi.boolean().label('with_identity')

        })

        this.requestPasswordReset = Joi.object({

            email: Joi.string().email().required().label('email')

        })

        this.resetPassword = Joi.object({

            email: Joi.string().email().required().label('email'),

            code: Joi.string().required().min(6).max(6).label('code'),

            token: Joi.string().required().label('token'),

            new_password: Joi.string().required().min(8).label('new_password').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).message('Password must contain at least one lowercase letter, one uppercase letter, and one digit')

        })

    }
}

module.exports = new ValidationSchema