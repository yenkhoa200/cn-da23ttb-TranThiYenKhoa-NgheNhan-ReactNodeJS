import { Router } from "express";
import healthRoutes from "./healthRoutes.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Backend ung dung van hoa dang hoat dong" });
});
router.use("/api", healthRoutes);

export default router;
