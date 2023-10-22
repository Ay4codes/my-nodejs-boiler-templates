const router = require("express").Router();
const userRoutes = require('./user.routes')
const authRoutes = require('./auth.routes');

router.use("/auth", authRoutes);

router.use("/users", userRoutes);

router.get("/", (req, res) => {
    
    res.status(200).json({ message: "Hello world from my nodejs-boilertemplate !!" });

});

module.exports = router;