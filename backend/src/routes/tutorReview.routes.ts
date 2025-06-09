import { Router } from "express";
import { TutorReviewController } from "../controller/TutorReviewController";

const router = Router();
const controller = new TutorReviewController();

router.post("/tutor-reviews", async (req, res) => {
  await controller.submit(req, res);
});

router.get("/tutor-reviews", async (req, res) => {
  await controller.getAll(req, res);
});
// ✅ Soft-delete: clear rank and comment instead of removing row
router.post("/tutor-reviews/delete", async (req, res) => {
  console.log("🔁 Soft delete route hit");
  await controller.delete(req, res); // This will now soft delete
});

export default router;
