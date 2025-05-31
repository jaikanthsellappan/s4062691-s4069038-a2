import { Router } from "express";
import { TutorApplicationController } from "../controller/TutorApplicationController";

const router = Router();
const controller = new TutorApplicationController();

router.post("/tutor-application", async (req, res) => {
  await controller.submit(req, res);
});

router.get("/tutor-application", async (req, res) => {
  await controller.getAll(req, res);
});

export default router;
