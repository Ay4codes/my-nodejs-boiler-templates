import mongoose from "mongoose"

export const isObjectIdOrString = (value) => {
    return mongoose.isValidObjectId(value) || typeof value === 'string'
}