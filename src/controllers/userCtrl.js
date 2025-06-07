import userServices from "../services/user.services.js"
import response from "../utils/response.js"

class UserCtrl {

    async createUser(req, res) {
        const createUser = await userServices.createUser(req.user, req.body)
        res.status(createUser.status).json(response(createUser.success, createUser.message, createUser.data, createUser.issue))
    }

    async onboardUser(req, res) {
        const onboardUser = await userServices.onboardUser(req.body)
        res.status(onboardUser.status).json(response(onboardUser.success, onboardUser.message, onboardUser.data, onboardUser.issue))
    }

    async getAllUser(req, res) {
        const getAllUser = await userServices.getAllUser(req.user, {firstname: req.query.firstname, lastname: req.query.lastname, email: req.query.email, status: req.query.status, role: req.query.role, dateCreated: req.query.dateCreated, minDateCreated: req.query.minDateCreated, maxDateCreated: req.query.maxDateCreated, start: req.query.start, limit: req.query.limit})
        res.status(getAllUser.status).json(response(getAllUser.success, getAllUser.message, getAllUser.data, getAllUser.issue))
    }

    async getCurrentUser(req, res) {
        const getCurrentUser = await userServices.getCurrentUser(req.user)
        res.status(getCurrentUser.status).json(response(getCurrentUser.success, getCurrentUser.message, getCurrentUser.data, getCurrentUser.issue))
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

export default new UserCtrl