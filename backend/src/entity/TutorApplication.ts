import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { Users } from "./User";

@Entity()
export class TutorApplication {
  @PrimaryGeneratedColumn()
  applicationId: number;

  @Column()
  courseCode: string;

  @Column()
  courseName: string;

  @Column()
  role: string;

  @Column()
  availability: string;

  @Column("simple-array")
  previousRoles: string[];

  @Column("simple-array")
  credentials: string[];

  @Column("simple-array")
  skills: string[];

  @ManyToOne(() => Users, (user) => user.applications)
  user: Users;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
