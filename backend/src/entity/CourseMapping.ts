import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Course } from "./Course";
import { Users } from "./User";

@Entity()
export class CourseMapping {
  @PrimaryColumn()
  courseCode: string;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => Course, (course) => course.assignments)
  @JoinColumn({ name: "courseCode" })
  course: Course;

  @ManyToOne(() => Users, (user) => user.assignedCourses)
  @JoinColumn({ name: "userId" })
  user: Users;
}
