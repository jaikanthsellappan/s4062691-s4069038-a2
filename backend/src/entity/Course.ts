import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { CourseMapping } from "./CourseMapping";

@Entity()
export class Course {
  @PrimaryColumn()
  code: string;

  @Column()
  name: string;

  @Column({ default: true })
  isAvailable: boolean;

  @OneToMany(() => CourseMapping, (assignment) => assignment.course)
  assignments: CourseMapping[];
}
