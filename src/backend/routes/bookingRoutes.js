const express = require("express");
const experienceBookingController = require("../controllers/experienceBookingController");
const requireTourist = require("../middlewares/requireTourist");

const router = express.Router();

router.post("/experiences/:activityId", requireTourist, experienceBookingController.create);
router.get("/mine", requireTourist, experienceBookingController.listMine);
router.get("/mine/:id", requireTourist, experienceBookingController.getMine);
router.patch("/mine/:id/cancel", requireTourist, experienceBookingController.cancelMine);

module.exports = router;
