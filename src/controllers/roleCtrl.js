import roleServices from "../services/role.services.js"
import response from "../utils/response.js"

class RoleCtrl {

    async createRole(req, res) {
        const createRole = await roleServices.createRole(req.user, req.body)
        res.status(createRole.status).json(response(createRole.success, createRole.message, createRole.data, createRole.issue))
    }

    async getRole(req, res) {
        const getRole = await roleServices.getRole(req.user, req.query.id)
        res.status(getRole.status).json(response(getRole.success, getRole.message, getRole.data, getRole.issue))
    }

    async getAllRoles(req, res) {
        const getAllRoles = await roleServices.getAllRoles(req.user, {name: req.query.name, status: req.query.status, dateCreated: req.query.dateCreated, minDateCreated: req.query.minDateCreated, maxDateCreated: req.query.maxDateCreated, start: req.query.start, limit: req.query.limit})
        res.status(getAllRoles.status).json(response(getAllRoles.success, getAllRoles.message, getAllRoles.data, getAllRoles.issue))
    }

    async getRoleHistory(req, res) {
        const getRoleHistory = await roleServices.getRoleHistory(req.user, {start: req.query.start, limit: req.query.limit})
        res.status(getRoleHistory.status).json(response(getRoleHistory.success, getRoleHistory.message, getRoleHistory.data, getRoleHistory.issue))
    }

    async updateRole(req, res) {
        const updateRole = await roleServices.updateRole(req.user, req.query.id, req.body)
        res.status(updateRole.status).json(response(updateRole.success, updateRole.message, updateRole.data, updateRole.issue))
    }

    async assignRoleToUser(req, res) {
        const assignRoleToUser = await roleServices.assignRoleToUser(req.user, req.body)
        res.status(assignRoleToUser.status).json(response(assignRoleToUser.success, assignRoleToUser.message, assignRoleToUser.data, assignRoleToUser.issue))
    }

    async removeRoleFromUser(req, res) {
        const removeRoleFromUser = await roleServices.removeRoleFromUser(req.user, req.body)
        res.status(removeRoleFromUser.status).json(response(removeRoleFromUser.success, removeRoleFromUser.message, removeRoleFromUser.data, removeRoleFromUser.issue))
    }

    async deleteRole(req, res) {
        const deleteRole = await roleServices.deleteRole(req.user, req.body)
        res.status(deleteRole.status).json(response(deleteRole.success, deleteRole.message, deleteRole.data, deleteRole.issue))
    }

}

export default new RoleCtrl