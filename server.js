const express = require('express')
const app = express()
const cluster = require('cluster');
const logger = require('./src/logger');
const { whiteListIpAddress } = require('./src/middleware/ips.middleware');
const { errorMiddlewareConfig } = require('./src/middleware/error.middleware');
const config = require('./config');
const numCPUs = require('os').cpus().length;


if (cluster.isMaster) {
  // Fork workers
  for (let i = 0; i < numCPUs; i++) cluster.fork();
  
  cluster.on('exit', (worker, code, signal) => {logger.info(`Worker ${worker.process.pid} died`)});
} else {
  // Pre Route MiddleWares
  require('./src/middleware/pre.route.middleware')(app)

  // Whitelisted Ip Address --->> Static Outbound & Admin
  // app.use(whiteListIpAddress);
  
  // Routes
  app.use(require('./src/routes'))

  // Error Middleware
  errorMiddlewareConfig(app)

  app.listen(3000, () => {
    // Initialize mongoDB connection
    require('./src/database/mongo')
      
    logger.info(`Server Started Successfully`);
  })
  
  app.on('error', (err) => {logger.warn(`Server On Error`)})
}