import mongoose from 'mongoose'
import { isObjectIdOrString } from '../utils/isObjectIdOrString.js'

const mediaSchema = mongoose.Schema({
    
    name: {type: String, default: null},

    user: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},

    description: {type: String},

    status: {type: String, required: true, default: 'ACTIVE'},

    useCase: {type: String, required: true, default: 'MEDIA', enum: ['MEDIA', 'DISPLAY_PICTURE']},

    directory: {type: String, required: true},

    contentType: {type: String, required: true},

    fileType: {type: String, required: true},

    downloadAccess: {type: Boolean, required: true},

    fileSize: {type: Number, required: true},

    createdBy: {type: mongoose.Schema.Types.Mixed, required: true, ref: 'user', validate: [isObjectIdOrString, 'createdBy must be an ObjectId or string'], default: 'system'},
    
    updatedBy: {type: mongoose.Schema.Types.Mixed, required: true, ref: 'user', validate: [isObjectIdOrString, 'updatedBy must be an ObjectId or string'], default: 'system'},

}, {timestamps: true})

export default mongoose.model('media', mediaSchema)