import enumServices from "../services/enums.service.js"
import response from "../utils/response.js"

class EnumCtrl {

    async getEnums(req, res) {
        const getEnums = await enumServices.getEnums()
        res.status(getEnums.status).json(response(getEnums.success, getEnums.message, getEnums.data, getEnums.issue))
    }

}

export default new EnumCtrl