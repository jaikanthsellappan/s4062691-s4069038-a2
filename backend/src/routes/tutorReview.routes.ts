import { Router } from "express";
import { TutorReviewController } from "../controller/TutorReviewController";

const router = Router();
const controller = new TutorReviewController();

// Endpoint to submit or update a tutor review
router.post("/tutor-reviews", async (req, res) => {
  await controller.submit(req, res);
});

// Endpoint to fetch all tutor reviews, optionally filtered by application ID
router.get("/tutor-reviews", async (req, res) => {
  await controller.getAll(req, res);
});

// Endpoint to soft delete a review (clears rank and comment but keeps the record)
router.post("/tutor-reviews/delete", async (req, res) => {
  console.log("Soft delete route triggered");
  await controller.delete(req, res);
});

export default router;
