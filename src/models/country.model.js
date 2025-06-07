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

    independent: { type: Boolean },

    status: { type: String },

    unMember: { type: Boolean },

    currencies: { type: Map, of: CurrencySchema },

    idd: { type: IddSchema },

    capital: [{ type: String }],

    altSpellings: [{ type: String }],

    region: { type: String },

    subregion: { type: String },

    languages: { type: Map, of: String },

    latlng: [{ type: Number, select: false }],

    landlocked: { type: Boolean },

    borders: [{ type: String }],

    area: { type: Number },

    demonyms: { type: DemonymsSchema, select: false },

    cca3: { type: String, unique: true },

    translations: { type: Map, of: TranslationSchema, select: false },

    flag: { type: String },

    maps: { type: MapsSchema, select: false },

    population: { type: Number },

    fifa: { type: String },

    car: { type: CarSchema, select: false },

    timezones: [{ type: String, select: false }],

    continents: [{ type: String, select: false }],

    flags: { type: FlagsSchema },

    coatOfArms: { type: CoatOfArmsSchema },

    startOfWeek: { type: String },

    capitalInfo: { type: CapitalInfoSchema, select: false },

    postalCode: { type: PostalCodeSchema, select: false },

}, { timestamps: true })


export default mongoose.model('country', countrySchema)