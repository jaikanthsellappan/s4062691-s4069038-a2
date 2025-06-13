import { AppDataSource } from "../data-source";
import { Course } from "../entity/Course";
import { Users } from "../entity/User";
import { CourseMapping } from "../entity/CourseMapping";
import { TutorReview } from "../entity/TutorReview";
import { TutorApplication } from "../entity/TutorApplication";
import { In } from "typeorm";


export const resolvers = {
  Query: {
    getCourses: async () => await AppDataSource.getRepository(Course).find(),
    getUsers: async () => await AppDataSource.getRepository(Users).find(),
    getCourseMappings: async () => await AppDataSource.getRepository(CourseMapping).find(),

    validateAdminLogin: async (_: any, { email }: any) => {
      const repo = AppDataSource.getRepository(Users);
      const user = await repo.findOneBy({ email });
      return !!user && user.role.toLowerCase() === "admin";
    },

    // NEW: Candidates chosen for each course
    getCandidatesPerCourseDetailed: async () => {
      const applications = await AppDataSource.getRepository(TutorApplication).find({
        relations: ["user"], // make sure TutorApplication has @ManyToOne(() => Users)
      });

      const courseToUsersMap = new Map<string, Map<number, Users>>();

      for (const app of applications) {
        const courseCode = app.courseCode;
        const user = app.user;

        if (!courseToUsersMap.has(courseCode)) {
          courseToUsersMap.set(courseCode, new Map());
        }

        courseToUsersMap.get(courseCode)!.set(user.id, user); // unique user per course
      }

      return Array.from(courseToUsersMap.entries()).map(([courseCode, userMap]) => ({
        courseCode,
        users: Array.from(userMap.values()),
      }));
    },

    // NEW: Candidates chosen for >3 courses
    getOverChosenCandidatesDetailed: async () => {
      // Step 1: Load all tutor applications along with user relation
      const applications = await AppDataSource.getRepository(TutorApplication).find({
        relations: ["user"],
      });

      // Step 2: Build map of userId to unique courseCodes
      const userCourseMap = new Map<number, Set<string>>();

      for (const app of applications) {
        const user = app.user;
        if (user.role !== "tutor") continue; // Only consider tutors

        const userId = user.id;
        const courseCode = app.courseCode;

        if (!userCourseMap.has(userId)) {
          userCourseMap.set(userId, new Set());
        }

        userCourseMap.get(userId)!.add(courseCode);
      }

      // Step 3: Extract userIds who have more than 3 unique courseCodes
      const overChosenUserIds = [...userCourseMap.entries()]
        .filter(([_, courseSet]) => courseSet.size > 3)
        .map(([userId]) => userId);

      // Step 4: Return full tutor objects for those IDs
      return await AppDataSource.getRepository(Users).findBy({
        id: In(overChosenUserIds),
        role: "tutor",
      });
    },

    // NEW: Candidates not chosen at all
    getUnchosenCandidatesDetailed: async () => {
      // Step 1: Get all tutors
      const tutorRepo = AppDataSource.getRepository(Users);
      const allTutors = await tutorRepo.find({
        where: { role: "tutor" },
      });

      // Step 2: Get all reviewed tutor userIds directly from TutorReview
      const reviews = await AppDataSource.getRepository(TutorReview).find();
      const reviewedUserIds = new Set(reviews.map((review) => review.id)); // <- userId from FK

      // Step 3: Filter tutors NOT reviewed
      const unchosenTutors = allTutors.filter((tutor) => !reviewedUserIds.has(tutor.id));
      return unchosenTutors;
    },
  },

  Mutation: {
    addCourse: async (_: any, { code, name }: any) => {
      const repo = AppDataSource.getRepository(Course);
      const course = repo.create({ code, name });
      return await repo.save(course);
    },

    editCourse: async (_: any, { code, name, isAvailable }: any) => {
      const repo = AppDataSource.getRepository(Course);
      const course = await repo.findOneBy({ code });
      if (!course) return null;
      course.name = name;
      course.isAvailable = isAvailable;
      return await repo.save(course);
    },

    deleteCourse: async (_: any, { code }: any) => {
      const courseMappings = await AppDataSource.getRepository(CourseMapping).count({ where: { courseCode: code } });
      const applications = await AppDataSource.getRepository(TutorApplication).count({ where: { courseCode: code } });

      if (courseMappings > 0 || applications > 0) {
        throw new Error("This course is currently assigned or has tutor applications and cannot be deleted.");
      }

      const result = await AppDataSource.getRepository(Course).delete({ code });
      return (result.affected ?? 0) > 0;
    },

    assignLecturer: async (_: any, { courseCode, userId }: any) => {
      const repo = AppDataSource.getRepository(CourseMapping);
      const mapping = repo.create({ courseCode, userId });
      await repo.save(mapping);
      return true;
    },

    blockCandidate: async (_: any, { userId }: any) => {
      const repo = AppDataSource.getRepository(Users);
      const user = await repo.findOneBy({ id: userId });
      if (!user) return false;
      user.isValid = false;
      await repo.save(user);
      return true;
    },

    unblockCandidate: async (_: any, { userId }: any) => {
      const repo = AppDataSource.getRepository(Users);
      const user = await repo.findOneBy({ id: userId });
      if (!user) return false;
      user.isValid = true;
      await repo.save(user);
      return true;
    },
  },
};
