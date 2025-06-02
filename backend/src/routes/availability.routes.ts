import { Router, Request, Response } from "express";
import { AvailabilityController } from "../controller/AvailabilityController";

const router = Router();
const controller = new AvailabilityController();

router.get("/availability", async (req: Request, res: Response) => {
  await controller.all(req, res);
});

export default router;