import { Router } from "express";
import { TutorApplicationController } from "../controller/TutorApplicationController";

const router = Router();
const controller = new TutorApplicationController();

// Endpoint to submit a new tutor application
router.post("/tutor-application", async (req, res) => {
  await controller.submit(req, res);
});

// Endpoint to retrieve all tutor applications from the database
router.get("/get-all-applications", async (req, res) => {
  await controller.getAll(req, res);
});

// Endpoint to get tutor applications filtered by the lecturer’s assigned courses
router.get("/tutorApplications", async (req, res) => {
  await controller.getFilteredApplications(req, res);
});

export default router;
