import authServices from "../services/auth.services.js"
import response from "../utils/response.js"

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
        const logout = await authServices.logout({refreshToken: req.headers.refreshToken})
        res.status(logout.status).json(response(logout.success, logout.message, logout.data, logout.issue))
    }

    async refreshToken(req, res) {
        const refreshToken = await authServices.refreshToken({refreshToken: req.headers.refreshToken})
        res.status(refreshToken.status).json(response(refreshToken.success, refreshToken.message, refreshToken.data, refreshToken.issue))
    }

    async verifyEmail(req, res) {
        const verifyEmail = await authServices.verifyEmail(req.body)
        res.status(verifyEmail.status).json(response(verifyEmail.success, verifyEmail.message, verifyEmail.data, verifyEmail.issue))
    }

    async requestPasswordReset(req, res) {
        const requestPasswordReset = await authServices.requestPasswordReset(req.body)
        res.status(requestPasswordReset.status).json(response(requestPasswordReset.success, requestPasswordReset.message, requestPasswordReset.data, requestPasswordReset.issue))
    }

    async resetPassword(req, res) {
        const resetPassword = await authServices.resetPassword(req.body)
        res.status(resetPassword.status).json(response(resetPassword.success, resetPassword.message, resetPassword.data, resetPassword.issue))
    }

}

export default new AuthCtrl