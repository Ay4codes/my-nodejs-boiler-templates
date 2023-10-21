const userServices = require("../services/user.services");
const response = require("../utils/response");

class UserCtrl {

    async getUser(req, res) {
        const getUser = await userServices.getUser(req.user)
        res.status(getUser.status).json(response(getUser.success, getUser.message, getUser.data, getUser.issue))
    }

    async updateUser(req, res) {
        const updateUser = await userServices.updateUser(req.body, req.user)
        res.status(updateUser.status).json(response(updateUser.success, updateUser.message, updateUser.data, updateUser.issue))
    }

    async changePassword(req, res) {
        const changePassword = await userServices.changePassword(req.body, req.user)
        res.status(changePassword.status).json(response(changePassword.success, changePassword.message, changePassword.data, changePassword.issue))
    }

}

module.exports = new UserCtrl