import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { SelectedTutor } from "../entity/SelectedTutor";
import { Users } from "../entity/User";
import { TutorApplication } from "../entity/TutorApplication";

// Handle tutor selection request
export const selectTutor = async (req: Request, res: Response) => {
  try {
    const { userId, applicationId } = req.body;

    // Find the user and application from the database
    const user = await AppDataSource.getRepository(Users).findOneBy({
      id: userId,
    });
    const application = await AppDataSource.getRepository(
      TutorApplication
    ).findOneBy({ applicationId });

    // If either user or application is missing, return 404
    if (!user || !application) {
      return res.status(404).json({ message: "User or Application not found" });
    }

    // Check if the tutor is already selected by this user
    const existing = await AppDataSource.getRepository(SelectedTutor).findOne({
      where: { user: { id: userId }, application: { applicationId } },
    });

    if (existing) {
      return res.status(409).json({ message: "Tutor already selected" });
    }

    // Create a new selection and save it
    const selection = new SelectedTutor();
    selection.user = user;
    selection.application = application;

    await AppDataSource.getRepository(SelectedTutor).save(selection);
    return res.status(201).json({ message: "Tutor selected successfully" });
  } catch (err) {
    console.error("Error selecting tutor:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Handle tutor unselection request
export const unselectTutor = async (req: Request, res: Response) => {
  try {
    const { userId, applicationId } = req.body;

    // Find the selection to remove
    const toRemove = await AppDataSource.getRepository(SelectedTutor).findOne({
      where: { user: { id: userId }, application: { applicationId } },
    });

    if (!toRemove) {
      return res.status(404).json({ message: "Selection not found" });
    }

    // Remove the selected tutor record
    await AppDataSource.getRepository(SelectedTutor).remove(toRemove);
    return res.status(200).json({ message: "Tutor unselected" });
  } catch (err) {
    console.error("Error unselecting tutor:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get all selected tutors for a specific user
export const getSelectedTutors = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);

    // Fetch selected tutors along with full application and user details
    const selections = await AppDataSource.getRepository(SelectedTutor).find({
      where: { user: { id: userId } },
      relations: ["application", "application.user"],
    });

    return res.status(200).json(selections);
  } catch (err) {
    console.error("Error fetching selected tutors:", err);
    return res.status(500).json({ message: "Failed to fetch selected tutors" });
  }
};
