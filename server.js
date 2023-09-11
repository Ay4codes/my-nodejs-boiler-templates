const express = require('express')
const app = express()
const cluster = require('cluster');
const logger = require('./src/logger');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
  
    cluster.on('exit', (worker, code, signal) => {
      logger.info(`Worker ${worker.process.pid} died`);
    });
} else {
    // Pre Route MiddleWares
    require('./src/middleware/pre.route.middleware')(app)
    
    // Routes
    app.use(require('./src/routes'))
    
    app.listen(3000, () => {
      // Initialize mongoDB connection
    //   require('./src/database/mongo')
        
      logger.info(`Server Started Successfully`);
    })
    
    app.on('error', (err) => {
      logger.warn(`Server On Error`);
    })   
}