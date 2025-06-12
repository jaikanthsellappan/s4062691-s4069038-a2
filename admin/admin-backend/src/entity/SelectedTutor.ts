// entity/SelectedTutor.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Users } from "./User";
import { TutorApplication } from "./TutorApplication";

@Entity()
export class SelectedTutor {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.selectedTutors, {
    onDelete: "CASCADE",
  })
  user: Users;

  @ManyToOne(() => TutorApplication, { onDelete: "CASCADE" })
  application: TutorApplication;

  @CreateDateColumn()
  createdAt: Date;
}
