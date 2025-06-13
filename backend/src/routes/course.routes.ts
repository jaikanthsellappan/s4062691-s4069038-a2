// src/routes/course.routes.ts
import { Router, Request, Response } from "express";
import { CourseController } from "../controller/CourseController";

// Create a new router instance
const router = Router();
// Create a controller instance to handle course-related operations
const controller = new CourseController();

// Route to fetch all courses that are currently available this semester
router.get("/availableCourses", async (req: Request, res: Response) => {
  await controller.available(req, res);
});

// Route to fetch all courses, regardless of availability
router.get("/allcourses", async (req: Request, res: Response) => {
  await controller.all(req, res);
});

export default router;
