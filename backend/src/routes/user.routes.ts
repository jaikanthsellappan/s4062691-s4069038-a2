import { Router } from "express";
import { UserController } from "../controller/UserController";
import multer from "multer";
import path from "path";

const router = Router();
const userController = new UserController();

// Configure storage for avatar file uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Route to handle user registration
router.post("/register", async (req, res) => {
  await userController.register(req, res);
});

// Route to handle user login
router.post("/login", async (req, res) => {
  await userController.login(req, res);
});

// Route to fetch user profile data
router.get("/profile", async (req, res) => {
  await userController.getProfile(req, res);
});

// Route to upload or update user avatar (expects multipart/form-data)
router.put("/profile/avatar", upload.single("avatar"), async (req, res) => {
  await userController.updateAvatar(req, res);
});

export default router;
