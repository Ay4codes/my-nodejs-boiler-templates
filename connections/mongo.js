const mongoose = require("mongoose");
const { database } = require("../config");
const logger = require("../src/logger");

const connectMongoDB = async () => {

    mongoose.set("strictQuery", false);

    mongoose.connect(database.connection.MONGO_URI, { useNewUrlParser: true})

    .then(() => logger.info('Connected to Mongo DB Database!'));
    
};

module.exports = {connectMongoDB}