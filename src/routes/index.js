import express from 'express';
const router = express.Router();
import userRoutes from './user.routes.js'
import authRoutes from './auth.routes.js'
import countryRoutes from './country.routes.js'
import enumRoutes from './enum.routes.js'
import privilegeRoutes from './privilege.routes.js'
import roleRoutes from './role.routes.js'
import modulesRoutes from './module.routes.js'
import mediaRoutes from './media.routes.js'

router.use("/auth", authRoutes);

router.use("/users", userRoutes);

router.use("/enums", enumRoutes);

router.use("/countries", countryRoutes);

router.use("/privilege", privilegeRoutes);

router.use("/role", roleRoutes);

router.use("/module", modulesRoutes);

router.use("/media", mediaRoutes);

router.get("/", (req, res) => {
    
    res.status(200).json({ message: "Hello world from my nodejs-boilertemplate !!" });

});

export default router;