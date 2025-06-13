import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany
} from "typeorm";
import { Users } from "./User";
import { TutorReview } from "./TutorReview";

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

  @OneToMany(() => TutorReview, (review) => review.application)
  reviews: TutorReview[];
}
