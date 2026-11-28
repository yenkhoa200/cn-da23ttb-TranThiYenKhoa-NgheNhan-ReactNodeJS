const express = require("express");
const artisanCraftController = require("../controllers/artisanCraftController");
const requireArtisan = require("../middlewares/requireArtisan");

const router = express.Router();

router.use(requireArtisan);
router.get("/", artisanCraftController.getAll);
router.post("/custom", artisanCraftController.createCustom);
router.post("/:id/select", artisanCraftController.select);
router.delete("/:id/select", artisanCraftController.remove);

module.exports = router;
