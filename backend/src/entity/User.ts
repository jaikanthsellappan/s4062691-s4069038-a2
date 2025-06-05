import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { TutorApplication } from "./TutorApplication";
import { CourseMapping } from "./CourseMapping";

export type UserRole = "tutor" | "lecturer";

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: "enum", enum: ["tutor", "lecturer"] })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  isValid: boolean;

  // ✅ NEW: Optional avatar image as base64 string or file reference
  @Column({ type: "longtext", nullable: true })
  avatar: string | null;

  @OneToMany(() => TutorApplication, (app) => app.user)
  applications: TutorApplication[];

  @OneToMany(() => CourseMapping, (assignment) => assignment.user)
  assignedCourses: CourseMapping[];
}
