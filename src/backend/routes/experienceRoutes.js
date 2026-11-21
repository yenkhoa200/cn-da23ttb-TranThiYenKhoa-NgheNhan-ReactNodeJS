const express = require("express");
const artisanExperienceController = require("../controllers/artisanExperienceController");

const router = express.Router();
router.get("/", artisanExperienceController.listPublic);

module.exports = router;
