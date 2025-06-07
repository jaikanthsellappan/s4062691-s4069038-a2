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
// ✅ Use POST for deletion to ensure body is parsed correctly
router.post("/tutor-reviews/delete", async (req, res) => {
  console.log("✅ DELETE route hit!");
  await controller.delete(req, res);
});

export default router;
