import { Router } from "express";
import { TutorApplicationController } from "../controller/TutorApplicationController";

const router = Router();
const controller = new TutorApplicationController();

router.post("/tutor-application", async (req, res) => {
  await controller.submit(req, res);
});

export default router;
