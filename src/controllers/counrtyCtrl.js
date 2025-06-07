import countryServices from "../services/country.services.js"
import response from "../utils/response.js"

class CountryCtrl {

    async getCountries(req, res) {
        const getCountries = await countryServices.getCountries()
        res.status(getCountries.status).json(response(getCountries.success, getCountries.message, getCountries.data, getCountries.issue))
    }

}

export default new CountryCtrl