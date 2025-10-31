import mongoose from 'mongoose'
import { APP_STATUSES } from '../constants/AppStatuses.js'
import { isObjectIdOrString } from '../utils/isObjectIdOrString.js'

const roleSchema = mongoose.Schema({
    
    name: {type: String, required: true},

    usersAdded: {type: Number, required: true, default: 0},

    description: {type: String, required: true},

    privileges: [{type: mongoose.Schema.Types.ObjectId, ref: 'privilege', select: false}],

    status: {type: String, required: true, default: "ACTIVE"},

    modules: [{type: mongoose.Schema.Types.ObjectId, ref: 'module', select: false}],

    createdBy: {type: mongoose.Schema.Types.Mixed, required: true, ref: 'user', validate: [isObjectIdOrString, 'createdBy must be an ObjectId or string'], default: 'system'},

    updatedBy: {type: mongoose.Schema.Types.Mixed, required: true, ref: 'user', validate: [isObjectIdOrString, 'updatedBy must be an ObjectId or string'], default: 'system'},

}, {timestamps: true})

export default mongoose.model('role', roleSchema)