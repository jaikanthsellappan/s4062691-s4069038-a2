// ✅ FIXED
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { SelectedTutor } from "../entity/SelectedTutor";
import { Users } from "../entity/User";
import { TutorApplication } from "../entity/TutorApplication";

// ✅ Fix: no RequestHandler typing — use (req: Request, res: Response) directly
export const selectTutor = async (req: Request, res: Response) => {
  try {
    const { userId, applicationId } = req.body;

    const user = await AppDataSource.getRepository(Users).findOneBy({
      id: userId,
    });
    const application = await AppDataSource.getRepository(
      TutorApplication
    ).findOneBy({ applicationId });

    if (!user || !application) {
      return res.status(404).json({ message: "User or Application not found" });
    }

    const existing = await AppDataSource.getRepository(SelectedTutor).findOne({
      where: { user: { id: userId }, application: { applicationId } },
    });

    if (existing) {
      return res.status(409).json({ message: "Tutor already selected" });
    }

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

export const unselectTutor = async (req: Request, res: Response) => {
  try {
    const { userId, applicationId } = req.body;

    const toRemove = await AppDataSource.getRepository(SelectedTutor).findOne({
      where: { user: { id: userId }, application: { applicationId } },
    });

    if (!toRemove) {
      return res.status(404).json({ message: "Selection not found" });
    }

    await AppDataSource.getRepository(SelectedTutor).remove(toRemove);
    return res.status(200).json({ message: "Tutor unselected" });
  } catch (err) {
    console.error("Error unselecting tutor:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getSelectedTutors = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
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
