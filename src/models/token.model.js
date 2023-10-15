const mongoose = require("mongoose");
const config = require("../../config");
const customDate = require('../utils/date')

const tokenSchema = mongoose.Schema({
    code: {
        type: String, 
        required: false,
        default: null,
    },
    token: {
        type: String,
        required: false,
        default: null,
    },
    type: {
        type: String,
        required: true,
        enum: [
            config.auth.tokens_types.refresh,
            config.auth.tokens_types.email_verification,
            config.auth.tokens_types.password_reset
        ]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    expiredAt: {
        type: Date,
        required: true,
        default: customDate.now,
        expires: config.auth.jwt.TOKEN_EXPIRES_IN
    }
}, {timestamps: true})

// set mongoose options to have lean turned on by default | ref: https://itnext.io/performance-tips-for-mongodb-mongoose-190732a5d382
mongoose.Query.prototype.setOptions = function () {
    if (this.mongooseOptions().lean == null) {
        this.mongooseOptions({ lean: true });
    }
    return this;
};

const Token = mongoose.model('token', tokenSchema)

module.exports = {Token}