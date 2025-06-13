import express from "express";
import * as SelectedTutorController from "../controller/SelectedTutorController";

const router = express.Router();

// Route to select a tutor for a specific lecturer
router.post("/selected-tutors", SelectedTutorController.selectTutor as any);

// Route to unselect (remove) a previously selected tutor
router.post(
  "/selected-tutors/delete",
  SelectedTutorController.unselectTutor as any
);

// Route to get all selected tutors for a specific lecturer by user ID
router.get(
  "/selected-tutors/:userId",
  SelectedTutorController.getSelectedTutors as any
);

export default router;
