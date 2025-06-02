import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Role } from "../entity/Role";

export class RoleController {
  private roleRepo = AppDataSource.getRepository(Role);

  async all(req: Request, res: Response) {
    const roles = await this.roleRepo.find();
    return res.json(roles);
  }
}
