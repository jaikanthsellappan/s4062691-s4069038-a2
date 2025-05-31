// src/routes/course.routes.ts
import { Router, Request, Response } from "express";
import { CourseController } from "../controller/CourseController";

const router = Router();
const controller = new CourseController();

router.get("/courses", async (req: Request, res: Response) => {
  await controller.all(req, res);
});

export default router;
