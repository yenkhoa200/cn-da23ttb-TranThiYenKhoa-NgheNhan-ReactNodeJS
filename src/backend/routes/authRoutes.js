const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/crafts", authController.listArtisanCrafts);
router.post("/register", authController.register);
router.post("/register-artisan", authController.registerArtisan);
router.post("/login", authController.login);

module.exports = router;
