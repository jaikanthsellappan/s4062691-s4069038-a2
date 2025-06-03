import { Router } from "express";
import { TutorApplicationController } from "../controller/TutorApplicationController";

const router = Router();
const controller = new TutorApplicationController();

router.post("/tutor-application", async (req, res) => {
  await controller.submit(req, res);
});

router.get("/get-all-applications", async (req, res) => {
  await controller.getAll(req, res);
});

router.get("/tutorApplications", async (req, res) => {
  await controller.getFilteredApplications(req, res);
});

export default router;
