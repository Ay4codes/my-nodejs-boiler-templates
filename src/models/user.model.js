const mongoose = require("mongoose");
const CustomDate = require('../utils/date')

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
        default: CustomDate.now
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    date: {
        day: {type: String, default: CustomDate.day},
        time: {type: String, default: CustomDate.time},
        month: {type: String, default: CustomDate.month},
        year: {type: String, default: CustomDate.year},
        custom_date: {type: String, default: CustomDate.date},
        date: {type: Date, default: CustomDate.now}
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

