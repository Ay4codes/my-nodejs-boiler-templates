const authServices = require("../services/auth.services");
const response = require("../utils/response");

class AuthCtrl {

    async registerUser(req, res) {
        const register = await authServices.register(req.body)
        res.status(register.status).json(response(register.success, register.message, register?.user || null))
    }

}

module.exports = new AuthCtrl