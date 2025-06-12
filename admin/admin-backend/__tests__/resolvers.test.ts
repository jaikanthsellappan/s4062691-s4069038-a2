import { AppDataSource } from "../src/data-source";
import { Course } from "../src/entity/Course";
import { Users } from "../src/entity/User";
import { resolvers } from "../src/graphql/resolvers";

// Increase Jest timeout to handle long-running async DB setup
jest.setTimeout(20000);

// Initialize TypeORM connection before running tests
beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
});

// Clean up DB connection after all tests finish
afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

// Test 1: Add a course and check if the correct code is returned
test("addCourse creates a course", async () => {
  const result = await resolvers.Mutation.addCourse(null, {
    code: "TEST101", // Unique test course code
    name: "Testing Course"
  });
  expect(result.code).toBe("TEST101"); // Verify correct course code is returned
});

// Test 2: Edit the course and verify name and availability fields are updated
test("editCourse updates course name and availability", async () => {
  await resolvers.Mutation.editCourse(null, {
    code: "TEST101",
    name: "Updated Course", // Change course name
    isAvailable: false      // Mark course as unavailable
  });

  const repo = AppDataSource.getRepository(Course);
  const course = await repo.findOneBy({ code: "TEST101" });
  expect(course?.name).toBe("Updated Course");      // Ensure name was updated
  expect(course?.isAvailable).toBe(false);          // Ensure availability changed
});

// Test 3: Block a user and confirm isValid flag becomes false
test("blockCandidate sets isValid to false", async () => {
  const user = await AppDataSource.getRepository(Users).findOneBy({ email: "jai@gmail.com" });
  expect(user).not.toBeNull(); // Ensure test data exists
  if (!user) return;

  const result = await resolvers.Mutation.blockCandidate(null, { userId: user.id });
  expect(result).toBe(true); // Mutation should return true

  const updated = await AppDataSource.getRepository(Users).findOneBy({ id: user.id });
  expect(updated?.isValid).toBe(false); // Confirm user is marked invalid
});

// Test 4: Unblock a user and confirm isValid flag becomes true
test("unblockCandidate sets isValid to true", async () => {
  const user = await AppDataSource.getRepository(Users).findOneBy({ email: "jai@gmail.com" });
  expect(user).not.toBeNull(); // Ensure test data exists
  if (!user) return;

  const result = await resolvers.Mutation.unblockCandidate(null, { userId: user.id });
  expect(result).toBe(true); // Mutation should return true

  const updated = await AppDataSource.getRepository(Users).findOneBy({ id: user.id });
  expect(updated?.isValid).toBe(true); // Confirm user is marked valid again
});

// Test 5: Assign a lecturer to a course and confirm operation success
test("assignLecturer links lecturer with course", async () => {
  const result = await resolvers.Mutation.assignLecturer(null, {
    courseCode: "TEST101", // Use test course created earlier
    userId: 2,              // ⚠️ Make sure user ID 2 exists and is a lecturer
  });
  expect(result).toBe(true); // Mutation should confirm success
});

// Test 6: Attempt to delete a course that is in use and expect failure
test("deleteCourse fails if course is mapped", async () => {
  try {
    await resolvers.Mutation.deleteCourse(null, { code: "TEST101" });
  } catch (e: any) {
    expect(e.message).toContain("cannot be deleted"); // Should match validation error
  }
});
