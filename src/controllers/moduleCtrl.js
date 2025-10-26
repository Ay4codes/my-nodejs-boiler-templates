import moduleServices from "../services/modules.service.js"
import response from "../utils/response.js"

class ModuleCtrl {

    async updateModule(req, res) {
        const updateModule = await moduleServices.updateModule(req.user, req.query.id, req.body)
        res.status(updateModule.status).json(response(updateModule.success, updateModule.message, updateModule.data, updateModule.issue))
    }

    async getAllModules(req, res) {
        const getAllModules = await moduleServices.getAllModules(req.user, {name: req.query.name, status: req.query.status})
        res.status(getAllModules.status).json(response(getAllModules.success, getAllModules.message, getAllModules.data, getAllModules.issue))
    }

    async getAllModulesList(req, res) {
        const getAllModulesList = await moduleServices.getAllModulesList(req.user)
        res.status(getAllModulesList.status).json(response(getAllModulesList.success, getAllModulesList.message, getAllModulesList.data, getAllModulesList.issue))
    }

    async getModule(req, res) {
        const getModule = await moduleServices.getModule(req.user, req.query.id)
        res.status(getModule.status).json(response(getModule.success, getModule.message, getModule.data, getModule.issue))
    }

}

export default new ModuleCtrl