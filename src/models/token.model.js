import mongoose from "mongoose";
import { CONFIG } from "../../config/index.js";
import CustomDate from '../utils/date.js'

const tokenTypes = Object.values(CONFIG.AUTH.TOKEN_TYPES);

const tokenSchema = mongoose.Schema({
    
    code: {type: String,  required: false, default: null},
    
    token: {type: String, required: false, default: null},
    
    type: {type: String,required: true, enum: tokenTypes},
    
    user: {type: mongoose.Schema.Types.ObjectId, required: true},
    
    expiredAt: {type: Date, required: true, default: CustomDate.now, expires: CONFIG.AUTH.TOKEN_EXPIRES_IN}

}, {timestamps: true})

export default mongoose.model('token', tokenSchema)