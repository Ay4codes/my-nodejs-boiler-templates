import mongoose from 'mongoose'
import CustomDate from '../utils/date.js'
import { CONFIG } from '../../config/index.js'

const userSchema = mongoose.Schema({
    
    first_name: {type: String, required: true},
    
    last_name: {type: String, required: true},
    
    email: {type: String, required: true, unique: true},
    
    phone_number: {type: String, required: false},
    
    account_disabled: {type: Boolean, required: true, default: false},
    
    email_verified: {type: Boolean, required: true, default: false},
    
    identity_verified: {type: Boolean, required: true, default: false},
    
    country: {type: String, required: true, default: CONFIG.SUPPORTED_COUNTRIES[0]},
    
    role: {type: String, required: true, enum: [CONFIG.ROLES], default: "user"},

    last_seen: {type: Date, required: true, default: CustomDate.now},
    
    password: {type: String, required: true, select: false},
    
    role: {type: String, required: true, enum: ["credentials", 'google'], default: "credentials"}

}, {timestamps: true})

export default mongoose.model('user', userSchema)