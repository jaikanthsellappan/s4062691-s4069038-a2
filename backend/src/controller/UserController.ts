import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Users } from "../entity/User";
import * as bcrypt from "bcrypt";

export class UserController {
  private userRepo = AppDataSource.getRepository(Users);

  async register(req: Request, res: Response) {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await this.userRepo.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    const savedUser = await this.userRepo.save(user);
    return res.status(201).json({ id: savedUser.id, email: savedUser.email, role: savedUser.role });
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    return res.json({
      message: `Welcome ${user.firstName}`,
      user: { id: user.id, email: user.email, name: user.firstName, role: user.role },
    });
  }
}
