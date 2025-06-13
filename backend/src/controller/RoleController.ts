import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Role } from "../entity/Role";

export class RoleController {
  // Create a repository instance to manage Role entities
  private roleRepo = AppDataSource.getRepository(Role);

  // This method returns all roles from the database
  async all(req: Request, res: Response) {
    const roles = await this.roleRepo.find();
    return res.json(roles);
  }
}
