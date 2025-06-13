import { Router, Request, Response } from "express";
import { RoleController } from "../controller/RoleController";

// Create a new Express router
const router = Router();
// Initialize the RoleController instance
const controller = new RoleController();

// Route to fetch all available user roles (e.g., Tutor, Lecturer, etc.)
router.get("/roles", async (req: Request, res: Response) => {
  await controller.all(req, res);
});

export default router;
