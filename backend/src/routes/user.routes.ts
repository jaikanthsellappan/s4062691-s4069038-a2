import { Router } from "express";
import { UserController } from "../controller/UserController";
import multer from "multer";
import path from "path";

const router = Router();
const userController = new UserController();

// ✅ Set up storage for avatar uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post("/register", async (req, res) => {
  await userController.register(req, res);
});

router.post("/login", async (req, res) => {
  await userController.login(req, res);
});
router.get("/profile", async (req, res) => {
  await userController.getProfile(req, res);
});

// 🖼️ Update avatar route (accepts multipart/form-data)
router.put("/profile/avatar", upload.single("avatar"), async (req, res) => {
  await userController.updateAvatar(req, res);
});

export default router;
