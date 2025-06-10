import express from "express";
import * as SelectedTutorController from "../controller/SelectedTutorController";

const router = express.Router();

// 👇 Add `as any` to each controller function
router.post("/selected-tutors", SelectedTutorController.selectTutor as any);
router.post(
  "/selected-tutors/delete",
  SelectedTutorController.unselectTutor as any
);
router.get(
  "/selected-tutors/:userId",
  SelectedTutorController.getSelectedTutors as any
);

export default router;
