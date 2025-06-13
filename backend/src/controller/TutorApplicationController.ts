import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { TutorApplication } from "../entity/TutorApplication";
import { Users } from "../entity/User";
import { CourseMapping } from "../entity/CourseMapping";

export class TutorApplicationController {
  private appRepo = AppDataSource.getRepository(TutorApplication);
  private userRepo = AppDataSource.getRepository(Users);

  // Handles tutor application submission
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

    // Basic validation to ensure required fields are present
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

    // Find user by email
    const user = await this.userRepo.findOneBy({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if this user has already submitted for the same course
    const existingApp = await this.appRepo.findOne({
      where: {
        user: { id: user.id },
        courseCode: courseCode,
      },
    });

    if (existingApp) {
      return res
        .status(409)
        .json({
          message: "You have already submitted an application for this course.",
        });
    } else {
      // Create a new application and save it
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

  // Returns all tutor applications with basic user details
  async getAll(req: Request, res: Response) {
    try {
      const applications = await this.appRepo.find({
        relations: ["user"], // Also fetch user data
        order: { createdAt: "DESC" }, // Show latest applications first
      });

      // Return only selected user fields to avoid exposing unnecessary data
      const filtered = applications.map((app) => ({
        ...app,
        user: {
          id: app.user.id,
          firstName: app.user.firstName,
          lastName: app.user.lastName,
          email: app.user.email,
        },
      }));

      return res.status(200).json(filtered);
    } catch (error) {
      console.error("Error fetching tutor applications:", error);
      return res
        .status(500)
        .json({ message: "Failed to retrieve applications" });
    }
  }

  // Returns tutor applications filtered by course mappings of a lecturer
  async getFilteredApplications(req: Request, res: Response) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
      }

      // Step 1: Find all course codes mapped to this lecturer
      const mappingRepo = AppDataSource.getRepository(CourseMapping);
      const mappings = await mappingRepo.find({
        where: { userId: Number(userId) },
      });

      const courseCodes = mappings.map((m) => m.courseCode);

      if (courseCodes.length === 0) {
        return res.status(200).json([]); // No courses mapped to this lecturer
      }

      // Step 2: Fetch all tutor applications related to those courses
      const applications = await this.appRepo.find({
        where: courseCodes.map((code) => ({ courseCode: code })),
        relations: ["user"],
        order: { createdAt: "DESC" },
      });

      // Return trimmed user data within each application
      const filtered = applications.map((app) => ({
        ...app,
        user: {
          id: app.user.id,
          firstName: app.user.firstName,
          lastName: app.user.lastName,
          email: app.user.email,
        },
      }));

      return res.status(200).json(filtered);
    } catch (error) {
      console.error("Error fetching tutor applications:", error);
      return res
        .status(500)
        .json({ message: "Failed to retrieve applications" });
    }
  }
}
