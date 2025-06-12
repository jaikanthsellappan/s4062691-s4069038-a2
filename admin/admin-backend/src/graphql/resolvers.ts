import { AppDataSource } from "../data-source";
import { Course } from "../entity/Course";
import { Users } from "../entity/User";
import { CourseMapping } from "../entity/CourseMapping";
import { TutorReview } from "../entity/TutorReview";
import { TutorApplication } from "../entity/TutorApplication";

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
      const reviews = await AppDataSource.getRepository(TutorReview).find({
        relations: ["user", "application"]
      });

      const courseMap = new Map<string, Users[]>();

      for (const review of reviews) {
        const courseCode = review.application.courseCode;
        if (!courseMap.has(courseCode)) {
          courseMap.set(courseCode, []);
        }
        courseMap.get(courseCode)!.push(review.user);
      }

      return Array.from(courseMap.entries()).map(([courseCode, users]) => ({
        courseCode,
        users
      }));
    },

    // NEW: Candidates chosen for >3 courses
    getOverChosenCandidatesDetailed: async () => {
      const reviews = await AppDataSource.getRepository(TutorReview).find({
        relations: ["user", "application"]
      });

      const userCourseMap = new Map<number, Set<string>>();

      for (const review of reviews) {
        const userId = review.user.id;
        const courseCode = review.application.courseCode;
        if (!userCourseMap.has(userId)) {
          userCourseMap.set(userId, new Set());
        }
        userCourseMap.get(userId)!.add(courseCode);
      }

      const overChosenUserIds = [...userCourseMap.entries()]
        .filter(([_, courses]) => courses.size > 3)
        .map(([userId]) => userId);

      return await AppDataSource.getRepository(Users).findByIds(overChosenUserIds);
    },

    // NEW: Candidates not chosen at all
    getUnchosenCandidatesDetailed: async () => {
      const allUsers = await AppDataSource.getRepository(Users).find();
      const reviews = await AppDataSource.getRepository(TutorReview).find({ relations: ["user"] });
      const chosenIds = new Set(reviews.map((r) => r.user.id));
      return allUsers.filter((u) => !chosenIds.has(u.id));
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
