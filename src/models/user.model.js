import mongoose from 'mongoose'
import CustomDate from '../utils/date.js'
import { isObjectIdOrString } from '../utils/isObjectIdOrString.js'

const userSchema = mongoose.Schema({
    
    first_name: {type: String},
    
    last_name: {type: String},
    
    email: {type: String, required: true, unique: true},
    
    status: {type: String, required: true, default: 'pending'},

    country: {type: mongoose.Schema.Types.ObjectId, ref: 'country'},
    
    email_verified: {type: Boolean, required: true, default: false, select: false},
            
    roles: [{type: mongoose.Schema.Types.ObjectId, ref: 'role', default: []}],

    position: {type: mongoose.Schema.Types.ObjectId, ref: 'position', default: null},
    
    department: {type: mongoose.Schema.Types.ObjectId, ref: 'department', default: null},

    last_seen: {type: Date, required: true, default: CustomDate.now, select: false},
    
    password: {type: String, select: false},
    
    auth_provider: {type: String, required: true, enum: ["credentials", 'google'], default: "credentials", select: false},

    createdBy: {type: mongoose.Schema.Types.Mixed, ref: 'user', validate: [isObjectIdOrString, 'createdBy must be an ObjectId or string'], default: 'system'},
    
    updatedBy: {type: mongoose.Schema.Types.Mixed, ref: 'user', validate: [isObjectIdOrString, 'updatedBy must be an ObjectId or string'], default: 'system'},

}, {timestamps: true})

export default mongoose.model('user', userSchema)