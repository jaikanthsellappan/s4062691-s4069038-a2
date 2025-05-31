import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { TutorApplication } from "../entity/TutorApplication";
import { Users } from "../entity/User";

export class TutorApplicationController {
  private appRepo = AppDataSource.getRepository(TutorApplication);
  private userRepo = AppDataSource.getRepository(Users);

  async submit(req: Request, res: Response) {
    const {
      courseCode,
      courseName,
      role,
      availability,
      previousRoles,
      credentials,
      skills,
      email,
    } = req.body;

    if (
      !courseCode ||
      !role ||
      !availability ||
      !credentials ||
      !skills ||
      !email
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const user = await this.userRepo.findOneBy({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if tutor has already applied for the selected course
    const existingApp = await this.appRepo.findOne({
    where: {
        user: { id: user.id },
        courseCode: courseCode,
    },
    });

    if (existingApp) {
    return res
        .status(409)
        .json({ message: "You have already submitted an application for this course." });
    }
    else{
        const application = this.appRepo.create({
        courseCode,
        courseName,
        role,
        availability,
        previousRoles,
        credentials,
        skills,
        user,
        });

        const saved = await this.appRepo.save(application);
        return res.status(201).json(saved);
        }

  }
async getAll(req: Request, res: Response) {
  try {
    const applications = await this.appRepo.find({
      relations: ["user"], // fetch user info (foreign key relation)
      order: { createdAt: "DESC" }, // optional: latest first
    });

    return res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching tutor applications:", error);
    return res.status(500).json({ message: "Failed to retrieve applications" });
  }
}

}
