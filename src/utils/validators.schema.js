const Joi = require('joi');
const mongoose = require('mongoose');

class Validator {

    constructor() {

        this.registerationSchema = Joi.object({

            firstname: Joi.string().min(3).max(30).required().label('first name'),

            lastname: Joi.string().min(3).max(30).required().label('last name'),

            email: Joi.string().email().required().label('email'),

            phone_number: Joi.string().min(6).max(15).label('phone number'),

            country: Joi.string().label('country'),

            password: Joi.string().min(8).required().label('password').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).message('Password must contain at least one lowercase letter, one uppercase letter, and one digit')

        });


    }
}

module.exports = new Validator