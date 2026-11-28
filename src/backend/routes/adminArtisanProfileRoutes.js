const express = require("express");
const requireAdmin = require("../middlewares/requireAdmin");
const artisanProfileController = require("../controllers/artisanProfileController");

const router = express.Router();

router.use(requireAdmin);
router.get("/artisans", artisanProfileController.listForAdmin);
router.put("/artisans/:id/status", artisanProfileController.updateVerificationStatus);

module.exports = router;
