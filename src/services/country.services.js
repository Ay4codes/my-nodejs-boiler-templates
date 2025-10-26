import Country from "../models/country.model.js"
import path from 'path'
import fs from 'fs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const countries = JSON.parse(fs.readFileSync(path.join(__dirname, '../../countries.json'), 'utf8'));

class CountryServices {

    async seedCountries () {

        const countriesCount = await Country.countDocuments()

        if (countriesCount === 0) {

            await Country.insertMany(countries)
            
            return {success: true, status: 200, message: 'Countries seeded successfully'}

        }

    }
    
    async getCountries () {

        const getCountries = await Country.find({}).sort({'name.common': 1})

        return {success: true, status: 200, message: 'Countries retrieved successfully', data: getCountries}

    }
    
}

export default new CountryServices