import mongoose from 'mongoose'

const NativeNameSchema = new mongoose.Schema({

    ara: {

        official: { type: String },

        common: { type: String }

    },

    eng: {

        official: { type: String },

        common: { type: String }

    },

    tir: {

        official: { type: String },

        common: { type: String }

    }

})


const NameSchema = new mongoose.Schema({

    common: { type: String },

    official: { type: String },

    nativeName: { type: NativeNameSchema, select: false }

})


const CurrencySchema = new mongoose.Schema({

    symbol: { type: String },

    name: { type: String }

})

const IddSchema = new mongoose.Schema({

    root: { type: String },

    suffixes: [{ type: String }]

})

const DemonymSchema = new mongoose.Schema({

    f: { type: String },

    m: { type: String }

})

const DemonymsSchema = new mongoose.Schema({

    eng: { type: DemonymSchema },

    fra: { type: DemonymSchema }

})

const TranslationSchema = new mongoose.Schema({

    official: { type: String },

    common: { type: String }

})

const MapsSchema = new mongoose.Schema({

    googleMaps: { type: String },

    openStreetMaps: { type: String }

})

const CarSchema = new mongoose.Schema({

    signs: [{ type: String }],

    side: { type: String }

})

const FlagsSchema = new mongoose.Schema({

    png: { type: String },

    svg: { type: String },

    alt: { type: String }

})

const CoatOfArmsSchema = new mongoose.Schema({

    png: { type: String },

    svg: { type: String }

})

const CapitalInfoSchema = new mongoose.Schema({

    latlng: [{ type: Number }]

})

const PostalCodeSchema = new mongoose.Schema({

    format: { type: String, default: null },

    regex: { type: String, default: null }

})

const countrySchema = new mongoose.Schema({

    name: { type: NameSchema },

    tld: [{ type: String, select: false }],

    cca2: { type: String, select: false },

    ccn3: { type: String, select: false },

    cioc: { type: String, select: false },

    independent: { type: Boolean, select: false },

    status: { type: String },

    unMember: { type: Boolean, select: false },

    currencies: { type: Map, of: CurrencySchema, select: false },

    idd: { type: IddSchema, select: false },

    capital: [{ type: String }],

    altSpellings: [{ type: String, select: false }],

    region: { type: String, select: false },

    subregion: { type: String, select: false },

    languages: { type: Map, of: String, select: false },

    latlng: [{ type: Number, select: false }],

    landlocked: { type: Boolean, select: false },

    borders: [{ type: String, select: false }],

    area: { type: Number, select: false },

    demonyms: { type: DemonymsSchema, select: false },

    cca3: { type: String, unique: true, select: false },

    translations: { type: Map, of: TranslationSchema, select: false },

    flag: { type: String, select: false },

    maps: { type: MapsSchema, select: false },

    population: { type: Number, select: false },

    fifa: { type: String, select: false },

    car: { type: CarSchema, select: false },

    timezones: [{ type: String, select: false }],

    continents: [{ type: String, select: false }],

    flags: { type: FlagsSchema, select: false },

    coatOfArms: { type: CoatOfArmsSchema, select: false },

    startOfWeek: { type: String, select: false },

    capitalInfo: { type: CapitalInfoSchema, select: false },

    postalCode: { type: PostalCodeSchema, select: false },

}, { timestamps: true })


export default mongoose.model('country', countrySchema)