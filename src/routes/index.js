import express from 'express';
const router = express.Router();
import userRoutes from './user.routes.js'
import authRoutes from './auth.routes.js'

router.use("/auth", authRoutes);

router.use("/users", userRoutes);

router.get("/", (req, res) => {
    
    res.status(200).json({ message: "Hello world from my nodejs-boilertemplate !!" });

});

export default router;