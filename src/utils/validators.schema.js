const Joi = require('joi');

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

    }
}

module.exports = new ValidationSchema