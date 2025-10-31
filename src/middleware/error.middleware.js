import logger from "../logger/index.js";
import response from "../utils/response.js";

const configureErrorMiddleware = (err, req, res, next) => {
    
    logger.error({message: err.message,  status: err.status, path: req.originalUrl, method: req.method, stack: err.stack});

    let statusCode = err.status || 500;

    let errorMessage = err.message || 'Internal Server Error';

    if (err.isJoi || (err.name === 'ValidationError' && err.details)) {

        statusCode = 400;

        errorMessage = err.details[0].message.replace(/['"]+/g, '');

    } 
    
    if (err.name === 'CastError' || err.name === 'MongoServerError') {

        statusCode = 400;

        errorMessage = `Invalid request data provided: ${err.value}`;

    }

    if (res.headersSent) {

        return next(err);

    }
    
    return res.status(statusCode).json(response(false, errorMessage, undefined, '-error'));
};
  
export default configureErrorMiddleware;