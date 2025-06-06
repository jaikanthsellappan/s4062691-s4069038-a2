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

export default router;
