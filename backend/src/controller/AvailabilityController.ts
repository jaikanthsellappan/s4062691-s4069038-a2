import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Availability } from "../entity/Availability";

export class AvailabilityController {
  private availabilityRepo = AppDataSource.getRepository(Availability);

  async all(req: Request, res: Response) {
    const availability = await this.availabilityRepo.find();
    return res.json(availability);
  }
}
