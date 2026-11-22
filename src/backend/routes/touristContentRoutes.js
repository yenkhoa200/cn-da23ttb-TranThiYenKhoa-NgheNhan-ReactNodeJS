const express = require("express");
const touristContentController = require("../controllers/touristContentController");

const router = express.Router();

router.get("/artisans", touristContentController.listArtisans);
router.get("/stories", touristContentController.listStories);
router.get("/traditional-crafts", touristContentController.listTraditionalCrafts);

module.exports = router;
