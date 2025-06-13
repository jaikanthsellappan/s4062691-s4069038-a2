import { Router, Request, Response } from "express";
import { AvailabilityController } from "../controller/AvailabilityController";

// Create a new router instance
const router = Router();
// Instantiate the controller to handle availability-related operations
const controller = new AvailabilityController();

// Define a route to fetch all availability records from the database
router.get("/availability", async (req: Request, res: Response) => {
  await controller.all(req, res);
});

export default router;
