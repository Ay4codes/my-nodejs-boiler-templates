const authServices = require("../services/auth.services");
const response = require("../utils/response");

class AuthCtrl {

    async registerUser(req, res) {
        const register = await authServices.register(req.body)
        res.status(register.status).json(response(register.success, register.message, register.data))
    }

    async loginUser(req, res) {
        const login = await authServices.login(req.body)
        res.status(login.status).json(response(login.success, login.message, login.data, login.issue))
    }

    async logoutUser(req, res) {
        const logout = await authServices.logout({refresh_token: req.headers.refresh_token})
        res.status(logout.status).json(response(logout.success, logout.message, logout.data))
    }

    async refreshToken(req, res) {
        const refreshToken = await authServices.refreshToken({refresh_token: req.headers.refresh_token})
        res.status(refreshToken.status).json(response(refreshToken.success, refreshToken.message, refreshToken.data))
    }

}

module.exports = new AuthCtrl