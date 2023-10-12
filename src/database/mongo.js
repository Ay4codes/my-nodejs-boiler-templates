const mongoose = require("mongoose");
const { database } = require("../../config");
const logger = require("../logger");

mongoose.set("strictQuery", false);
mongoose.connect(database.connection.MONGO_URI, { useNewUrlParser: true})
.then(() => logger.info('Connected to Mongo DB Database!'));