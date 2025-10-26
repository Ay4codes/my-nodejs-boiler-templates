import userServices from "../services/user.services.js"
import response from "../utils/response.js"

class UserCtrl {

    async createUser(req, res) {
        const createUser = await userServices.createUser(req.user, req.body)
        res.status(createUser.status).json(response(createUser.success, createUser.message, createUser.data, createUser.issue))
    }

    async resendOnboardingLink(req, res) {
        const resendOnboardingLink = await userServices.resendOnboardingLink(req.user, req.body)
        res.status(resendOnboardingLink.status).json(response(resendOnboardingLink.success, resendOnboardingLink.message, resendOnboardingLink.data, resendOnboardingLink.issue))
    }

    async onboardUser(req, res) {
        const onboardUser = await userServices.onboardUser(req.body)
        res.status(onboardUser.status).json(response(onboardUser.success, onboardUser.message, onboardUser.data, onboardUser.issue))
    }

    async getUser(req, res) {
        const getUser = await userServices.getUser(req.user, req.query.id)
        res.status(getUser.status).json(response(getUser.success, getUser.message, getUser.data, getUser.issue))
    }

    async getAllUser(req, res) {
        const getAllUser = await userServices.getAllUser(req.user, {firstName: req.query.firstName, lastName: req.query.lastName, email: req.query.email, status: req.query.status, role: req.query.role, dateCreated: req.query.dateCreated, minDateCreated: req.query.minDateCreated, maxDateCreated: req.query.maxDateCreated, start: req.query.start, limit: req.query.limit})
        res.status(getAllUser.status).json(response(getAllUser.success, getAllUser.message, getAllUser.data, getAllUser.issue))
    }

    async getAllUserList(req, res) {
        const getAllUserList = await userServices.getAllUserList(req.user)
        res.status(getAllUserList.status).json(response(getAllUserList.success, getAllUserList.message, getAllUserList.data, getAllUserList.issue))
    }

    async getCurrentUser(req, res) {
        const getCurrentUser = await userServices.getCurrentUser(req.user)
        res.status(getCurrentUser.status).json(response(getCurrentUser.success, getCurrentUser.message, getCurrentUser.data, getCurrentUser.issue))
    }

    async updateUsers(req, res) {
        const updateUsers = await userServices.updateUsers(req.user, req.body)
        res.status(updateUsers.status).json(response(updateUsers.success, updateUsers.message, updateUsers.data, updateUsers.issue))
    }

    async updateUser(req, res) {
        const updateUser = await userServices.updateUser(req.user, req.body)
        res.status(updateUser.status).json(response(updateUser.success, updateUser.message, updateUser.data, updateUser.issue))
    }

    async deactivateUser(req, res) {
        const deactivateUser = await userServices.deactivateUser(req.user, req.query.id)
        res.status(deactivateUser.status).json(response(deactivateUser.success, deactivateUser.message, deactivateUser.data, deactivateUser.issue))
    }

    async reactivateUser(req, res) {
        const reactivateUser = await userServices.reactivateUser(req.user, req.query.id)
        res.status(reactivateUser.status).json(response(reactivateUser.success, reactivateUser.message, reactivateUser.data, reactivateUser.issue))
    }

    async changePassword(req, res) {
        const changePassword = await userServices.changePassword(req.user, req.body)
        res.status(changePassword.status).json(response(changePassword.success, changePassword.message, changePassword.data, changePassword.issue))
    }

}

export default new UserCtrl