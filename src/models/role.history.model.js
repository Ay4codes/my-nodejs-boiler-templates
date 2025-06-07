import mongoose from 'mongoose'
import { isObjectIdOrString } from '../utils/isObjectIdOrString.js'
import { APP_STATUSES } from '../constants/AppStatuses.js'

const roleHistorySchema = new mongoose.Schema({

    status: {type: String, required: true, default: APP_STATUSES[0]},

    action: {type: String, enum: ['assign', 'remove'], required: true},
    
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    
    role: {type: mongoose.Schema.Types.ObjectId, ref: 'role', required: true},
        
    createdBy: {type: mongoose.Schema.Types.Mixed, required: true, ref: 'user', validate: [isObjectIdOrString, 'createdBy must be an ObjectId or string'], default: 'system'},
        
    updatedBy: {type: mongoose.Schema.Types.Mixed, required: true, ref: 'user', validate: [isObjectIdOrString, 'updatedBy must be an ObjectId or string'], default: 'system'},

}, {timestamps: true})

export default mongoose.model('RoleHistory', roleHistorySchema)