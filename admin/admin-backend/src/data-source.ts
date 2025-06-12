import "reflect-metadata";
import { DataSource } from "typeorm";
import { Users } from "./entity/User";
import { TutorApplication } from "./entity/TutorApplication";
import { Course } from "./entity/Course";
import { Availability } from "./entity/Availability";
import { Role } from "./entity/Role";
import { CourseMapping } from "./entity/CourseMapping";
import { TutorReview } from "./entity/TutorReview";
import { SelectedTutor } from "./entity/SelectedTutor";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "209.38.26.237",
  port: 3306,
  /* Change to your own credentials */
  username: "S4062691",
  password: "Jai@123456",
  database: "S4062691",
  // synchronize: true will automatically create database tables based on entity definitions
  // and update them when entity definitions change. This is useful during development
  // but should be disabled in production to prevent accidental data loss.
  synchronize: true,
  logging: true,
  entities: [
    Users,
    TutorApplication,
    Course,
    Availability,
    Role,
    CourseMapping,
    TutorReview,
    SelectedTutor,
  ],
  migrations: [],
  subscribers: [],
});
