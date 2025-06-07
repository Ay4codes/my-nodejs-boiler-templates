import express from 'express';
const router = express.Router();
import userRoutes from './user.routes.js'
import authRoutes from './auth.routes.js'
import countryRoutes from './country.routes.js'
import enumRoutes from './enum.routes.js'
import privilegeRoutes from './privilege.routes.js'

router.use("/v1/auth", authRoutes);

router.use("/v1/users", userRoutes);

router.use("/v1/enums", enumRoutes);

router.use("/v1/countries", countryRoutes);

router.use("/v1/privilege", privilegeRoutes);

router.get("/", (req, res) => {
    
    res.status(200).json({ message: "Hello world from my nodejs-boilertemplate !!" });

});

export default router;