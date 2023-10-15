const mongoose = require("mongoose");
const customDate = require('../utils/date')

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone_number: {
        type: String,
        required: false,
    },
    account_disabled: {
        type: Boolean,
        required: true,
        default: false,
    },
    email_verified: {
        type: Boolean,
        required: true,
        default: false,
    },
    identity_verified: {
        type: Boolean,
        required: true,
        default: false,
    },
    country: {
        type: String,
        required: true,
        default: 'NG'
    },
    role: {
        type: String,
        required: true,
        enum: ["user", 'admin'],
        default: "user"
    },
    last_seen: {
        type: Date,
        required: true,
        default: customDate.now
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    date: {
        day: {type: String, default: customDate.day},
        time: {type: String, default: customDate.time},
        month: {type: String, default: customDate.month},
        year: {type: String, default: customDate.year},
        custom_date: {type: String, default: customDate.date},
        date: {type: Date, default: customDate.now}
    },
}, {timestamps: true})

  
// set mongoose options to have lean turned on by default | ref: https://itnext.io/performance-tips-for-mongodb-mongoose-190732a5d382
mongoose.Query.prototype.setOptions = function () {
    if (this.mongooseOptions().lean == null) {
        this.mongooseOptions({ lean: true });
    }
    return this;
};

const User = mongoose.model('user', userSchema)

module.exports = {User}

