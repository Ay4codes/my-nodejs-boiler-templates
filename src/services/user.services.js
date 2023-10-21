const { BCRYPT_SALT } = require("../../config");
const { User } = require("../models/user.model")
const ValidationSchema = require("../utils/validators.schema")
const bcrypt = require('bcrypt');

class UserServices {

    async getUser (user) {

        return {success: true, status: 200, message: 'User fetched successfully', data: {user: user}}

    }


    async updateUser (body, user) {

        const {error, value: data} = ValidationSchema.updateUser.validate(body)

        if (error) return {success: false, status: 400, message: error.message}

        await User.updateOne({_id: user._id}, {$set: {first_name: data.firstname, last_name: data.lastname}})

        const findUser = await User.findOne({_id: user._id})

        return {success: true, status: 200, message: 'User updated successfully', data: {user: findUser}}

    }


    async changePassword (body, user) {

        const {error, value: data} = ValidationSchema.changePassword.validate(body)

        if (error) return {success: false, status: 400, message: error.message}

        const findUser = await User.findOne({_id: user._id}).select('+password')

        const verifyOldPass = await bcrypt.compare(data.old_password, findUser.password)

        if (!verifyOldPass) return {success: false, status: 401, message: "Old password is invalid", issue: '-invalid_credentials'}

        const hashedPassword = bcrypt.hashSync(data.new_password, BCRYPT_SALT)

        await User.updateOne({_id: findUser._id}, {$set: {password: hashedPassword}})

        return {success: true, status: 200, message: 'Password changed successfully'}

    }
    
}

module.exports = new UserServices