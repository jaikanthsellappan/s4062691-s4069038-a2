import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Course } from "../entity/Course";

export class CourseController {
  private courseRepo = AppDataSource.getRepository(Course);

  async all(req: Request, res: Response) {
  try {
    const courses = await this.courseRepo.find();
    return res.json(courses);
  } catch (error) {
    console.error("Error fetching all courses:", error);
    return res.status(500).json({ message: "Failed to fetch courses." });
  }
}

  // method to get available courses only for this semester
  async available(req: Request, res: Response) {
    try {
      const availableCourses = await this.courseRepo.find({
        where: { isAvailable: true },
      });
      return res.json(availableCourses);
    } catch (error) {
      console.error("Error in fetching available courses:", error);
      return res.status(500).json({ message: "Failed to fetch available courses." });
    }
  }

}
