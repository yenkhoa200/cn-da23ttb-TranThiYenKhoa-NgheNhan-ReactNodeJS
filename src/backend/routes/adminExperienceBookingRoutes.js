const express = require("express");
const experienceBookingController = require("../controllers/experienceBookingController");
const requireAdmin = require("../middlewares/requireAdmin");

const router = express.Router();
router.use(requireAdmin);

router.get("/", experienceBookingController.listAdmin);
router.patch("/:id/status", experienceBookingController.updateAdminStatus);

module.exports = router;
