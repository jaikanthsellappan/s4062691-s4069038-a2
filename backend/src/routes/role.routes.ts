import { Router, Request, Response } from "express";
import {RoleController} from "../controller/RoleController"

const router = Router();
const controller = new RoleController();

router.get("/roles", async (req: Request, res: Response) => {
  await controller.all(req, res);
});

export default router;