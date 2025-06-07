import Country from "../models/country.model.js"

class CountryServices {
    
    async getCountries () {

        const getCountries = await Country.find({}).sort({'name.common': 1})

        return {success: true, status: 200, message: 'Countries retrieved successfully', data: getCountries}

    }
    
}

export default new CountryServices