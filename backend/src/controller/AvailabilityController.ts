import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Availability } from "../entity/Availability";

export class AvailabilityController {
  // Get access to the Availability entity from the database
  private availabilityRepo = AppDataSource.getRepository(Availability);

  // Handle GET requests to fetch all availability options
  async all(req: Request, res: Response) {
    const availability = await this.availabilityRepo.find();
    return res.json(availability);
  }
}
