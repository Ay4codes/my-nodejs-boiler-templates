const router = require("express").Router();
const crypto = require('crypto')
const userRoutes = require('./user.routes')
const authRoutes = require('./auth.routes');
const tokenServices = require("../services/token.services");

router.use("/auth", authRoutes);

router.use("/users", userRoutes);

router.get("/", (req, res) => {
    const otp = crypto.randomBytes(3).readUInt16BE(0) % 1000000; //only numbers

        const code = otp.toString().padStart(6, (Math.floor(Math.random() * 9) + 1).toString()); // Ensure it's exactly 6 digits by left-padding with a number if necessary

        console.log(code);
    
    res.status(200).json({ message: "Hello world from my nodejs-boilertemplate !!" });
});

module.exports = router;