import express from 'express'
import logger from './src/logger/index.js';
import MailerInstance from './src/connections/mailer.js';
import configurePreRouteMiddleware from './src/middleware/pre.route.middleware.js';
import routes from './src/routes/index.js'
import { DEPLOYMENT_ENV } from './config/index.js';
import connectMongoDB from './src/connections/mongo.js';
import privilegeServices from './src/services/privilege.services.js';
import roleServices from './src/services/role.services.js';
import moduleService from './src/services/modules.service.js';
import userServices from './src/services/user.services.js';
import countryServices from './src/services/country.services.js';

const app = express()

const PORT = process.env.PORT || 4000;

configurePreRouteMiddleware(app)

app.use(routes)

app.listen(PORT, async () => {
  
  await connectMongoDB()

  await MailerInstance.verifyConnection()

  await moduleService.seedModules()

  await privilegeServices.seedPrivileges()

  await roleServices.seedRoles()

  await userServices.seedUsers()

  await countryServices.seedCountries()

  logger.info(`:::> Server listening on port ${PORT} @ http://localhost:${PORT} in ${DEPLOYMENT_ENV} mode <:::`);

})

export default app