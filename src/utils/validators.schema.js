const Joi = require('joi');
const mongoose = require('mongoose');

class Validator {
    onRegisterSchema (body) {
        const schema = Joi.object({
            fullname: Joi.string().trim().required(),
            email: Joi.string().trim().email().required()
        });

        const result = schema.validate(body);

        return {error: result.error, value: result.value};
    }
}

module.exports = new Validator