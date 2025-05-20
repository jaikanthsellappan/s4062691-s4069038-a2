import { Router } from "express";
import { UserController } from "../controller/UserController";

const router = Router();
const userController = new UserController();

router.post("/register", async (req, res) => {
  await userController.register(req, res);
});

router.post("/login", async (req, res) => {
  await userController.login(req, res);
});


export default router;
