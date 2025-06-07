import privilegeServices from "../services/privilege.services.js"
import response from "../utils/response.js"

class PrivilegeCtrl {

    async updatePrivilege(req, res) {
        const updatePrivilege = await privilegeServices.updatePrivilege(req.user, req.query.id, req.body)
        res.status(updatePrivilege.status).json(response(updatePrivilege.success, updatePrivilege.message, updatePrivilege.data, updatePrivilege.issue))
    }

    async getAllPrivileges(req, res) {
        const getAllPrivileges = await privilegeServices.getAllPrivileges(req.user, {name: req.query.name, status: req.query.status})
        res.status(getAllPrivileges.status).json(response(getAllPrivileges.success, getAllPrivileges.message, getAllPrivileges.data, getAllPrivileges.issue))
    }

    async getPrivilege(req, res) {
        const getPrivilege = await privilegeServices.getPrivilege(req.user, req.query.id)
        res.status(getPrivilege.status).json(response(getPrivilege.success, getPrivilege.message, getPrivilege.data, getPrivilege.issue))
    }

}

export default new PrivilegeCtrl