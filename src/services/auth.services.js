const {User} = require("../models/user.model")
const Validator = require('../utils/validators.schema')

class authServices {

    async register (body) {

        const {error, value: data} = Validator.registerationSchema.validate(body)

        if (error) return {success: false, status: 400, message: error.message}

        console.log(data); // WIP

        // const userExist = await User.findOne({email: data.email, ...(data.phone_number ? { phone_number: data.phone_number } : {}), })

    }

}

module.exports = new authServices