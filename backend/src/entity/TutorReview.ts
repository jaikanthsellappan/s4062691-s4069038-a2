import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, CreateDateColumn, UpdateDateColumn
} from "typeorm";
import { Users } from "./User";
import { TutorApplication } from "./TutorApplication";

@Entity()
export class TutorReview {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users)
  user: Users;

  @ManyToOne(() => TutorApplication)
  application: TutorApplication;

  @Column()
  rank: number;

  @Column({ type: "text", nullable: true })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
