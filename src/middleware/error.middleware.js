import logger from "../logger/index.js";
import response from "../utils/response.js";

const configureErrorMiddleware = (err, req, res, next) => {

    logger.error({message: err.message, stack: err.stack});

    const statusCode = err.status || 500;

    const errorMessage = err.message || 'Internal Server Error'

    res.status(statusCode).json(response(false, errorMessage, undefined, '-error'));

}
  
export default configureErrorMiddleware