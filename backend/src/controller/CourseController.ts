import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Course } from "../entity/Course";

export class CourseController {
  private courseRepo = AppDataSource.getRepository(Course);

  async all(req: Request, res: Response) {
    const courses = await this.courseRepo.find();
    return res.json(courses);
  }
}
