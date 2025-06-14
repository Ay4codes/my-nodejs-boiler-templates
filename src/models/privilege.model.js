import mongoose from 'mongoose'
import { APP_STATUSES } from '../constants/AppStatuses.js'
import { isObjectIdOrString } from '../utils/isObjectIdOrString.js'

const privilegesSchema = mongoose.Schema({
    
    name: {type: String, required: true},

    description: {type: String, required: true},

    status: {type: String, required: true, default: APP_STATUSES[0]},

    createdBy: {type: mongoose.Schema.Types.Mixed, required: true, ref: 'user', validate: [isObjectIdOrString, 'createdBy must be an ObjectId or string'], default: 'system'},
    
    updatedBy: {type: mongoose.Schema.Types.Mixed, required: true, ref: 'user', validate: [isObjectIdOrString, 'updatedBy must be an ObjectId or string'], default: 'system'},

}, {timestamps: true})

export default mongoose.model('privilege', privilegesSchema)