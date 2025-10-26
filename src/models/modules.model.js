import mongoose from 'mongoose'
import { isObjectIdOrString } from '../utils/isObjectIdOrString.js'

const modulesSchema = mongoose.Schema({
    
    name: {type: String, required: true},

    description: {type: String, required: true},

    status: {type: String, required: true, default: 'PENDING'},

    createdBy: {type: mongoose.Schema.Types.Mixed, required: true, ref: 'user', validate: [isObjectIdOrString, 'createdBy must be an ObjectId or string'], default: 'system'},
    
    updatedBy: {type: mongoose.Schema.Types.Mixed, required: true, ref: 'user', validate: [isObjectIdOrString, 'updatedBy must be an ObjectId or string'], default: 'system'},

}, {timestamps: true})

export default mongoose.model('module', modulesSchema)