import mongoose from 'mongoose'
import CustomDate from '../utils/date.js'
import { isObjectIdOrString } from '../utils/isObjectIdOrString.js'

const userSchema = mongoose.Schema({
    
    firstName: {type: String},
    
    lastName: {type: String},
    
    email: {type: String, required: true, unique: true},

    phoneNumber: {type: String},

    sex: {type: String},

    isCompanyUser: {type: Boolean, default: false},
    
    status: {type: String, required: true, default: 'PENDING'},

    country: {type: mongoose.Schema.Types.ObjectId, ref: 'country'},
                
    roles: [{type: mongoose.Schema.Types.ObjectId, ref: 'role', default: []}],

    position: {type: mongoose.Schema.Types.ObjectId, ref: 'position', default: null},
    
    department: {type: mongoose.Schema.Types.ObjectId, ref: 'department', default: null},

    lastSeen: {type: Date, required: true, default: CustomDate.now, select: false},
    
    password: {type: String, select: false},
    
    authProvider: {type: String, required: true, enum: ["CREDENTIALS", 'GOOGLE'], default: "CREDENTIALS", select: false},

    createdBy: {type: mongoose.Schema.Types.Mixed, ref: 'user', validate: [isObjectIdOrString, 'createdBy must be an ObjectId or string'], default: 'system'},
    
    updatedBy: {type: mongoose.Schema.Types.Mixed, ref: 'user', validate: [isObjectIdOrString, 'updatedBy must be an ObjectId or string'], default: 'system'},

}, {timestamps: true})

export default mongoose.model('user', userSchema)