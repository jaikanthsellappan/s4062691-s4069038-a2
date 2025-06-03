// src/routes/course.routes.ts
import { Router, Request, Response } from "express";
import { CourseController } from "../controller/CourseController";

const router = Router();
const controller = new CourseController();

router.get("/availableCourses", async (req: Request, res: Response) => {
  await controller.available(req, res);
});

router.get("/allcourses", async (req: Request, res: Response) => {
  await controller.all(req, res);
});

export default router;
