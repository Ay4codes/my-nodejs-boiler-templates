import mongoose from "mongoose";
import { CONFIG } from "../../config/index.js";
import logger from "../logger/index.js";

const connectMongoDB = async () => {

    mongoose.set("strictQuery", false);

    mongoose.connect(CONFIG.DB.MONGO_URI, { useNewUrlParser: true})

    .then(() => logger.info('Connected to Mongo DB Database!'));
    
};

export default connectMongoDB