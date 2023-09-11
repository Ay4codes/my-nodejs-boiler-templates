const trimRequestBody = (req, res, next) => {
  const traverse = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        if (key === 'email') {
          obj[key] = obj[key].toLowerCase().trim();
        } else {
          obj[key] = obj[key].trim();
        }
      } else if (typeof obj[key] === 'object') {
        traverse(obj[key]);
      }
    }
  };

  // Call the traverse function to trim request body
  traverse(req.body);

  // Call next() to pass control to the next middleware
  next();
}

module.exports = trimRequestBody