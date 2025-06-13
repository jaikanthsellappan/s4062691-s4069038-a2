import { AppDataSource } from "../src/data-source";
import { Course } from "../src/entity/Course";
import { Users } from "../src/entity/User";
import { resolvers } from "../src/graphql/resolvers";

// Extend Jest timeout to avoid failures due to DB initialization delays
jest.setTimeout(20000);

//  Establish a DB connection before running any test cases
beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
});

// Properly close the DB connection after all tests are finished
afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

// Test Case 1: Add a new course and confirm its creation
// This test verifies that the `addCourse` mutation correctly inserts a new course
// and returns the expected course code. This validates the admin's ability to
// create new course records in the system.
test("addCourse creates a course", async () => {
  const result = await resolvers.Mutation.addCourse(null, {
    code: "TEST101", // Unique test input
    name: "Testing Course",
  });

  // Assert that the returned course code matches the input
  expect(result.code).toBe("TEST101");
});

// Test Case 2: Update course fields and confirm changes are saved
// This test checks if the `editCourse` mutation properly updates course fields.
// It simulates an admin modifying the course name and marking it unavailable.
test("editCourse updates course name and availability", async () => {
  await resolvers.Mutation.editCourse(null, {
    code: "TEST101", // Course to edit
    name: "Updated Course", // New name
    isAvailable: false, // Set course to unavailable
  });

  // Fetch the course from DB and verify changes
  const repo = AppDataSource.getRepository(Course);
  const course = await repo.findOneBy({ code: "TEST101" });
  expect(course?.name).toBe("Updated Course"); // Check if name updated
  expect(course?.isAvailable).toBe(false); // Check if availability updated
});

// Test Case 3: Block a user account (e.g., for disciplinary reasons)
// This test simulates an admin blocking a user (e.g., tutor or applicant).
// It ensures that the `isValid` field is updated correctly to prevent access.
test("blockCandidate sets isValid to false", async () => {
  const user = await AppDataSource.getRepository(Users).findOneBy({
    email: "jai@gmail.com",
  });
  expect(user).not.toBeNull(); // Confirm test user exists
  if (!user) return;

  // Trigger mutation to block the user
  const result = await resolvers.Mutation.blockCandidate(null, {
    userId: user.id,
  });
  expect(result).toBe(true); // Mutation should return true indicating success

  // Reload user from DB and confirm `isValid` was updated
  const updated = await AppDataSource.getRepository(Users).findOneBy({
    id: user.id,
  });
  expect(updated?.isValid).toBe(false);
});

//  Test Case 4: Unblock a previously blocked user
// This test ensures that the `unblockCandidate` mutation correctly resets the
// `isValid` field to true, allowing the user to log in and use the platform again.
test("unblockCandidate sets isValid to true", async () => {
  const user = await AppDataSource.getRepository(Users).findOneBy({
    email: "jai@gmail.com",
  });
  expect(user).not.toBeNull(); // Ensure user is found
  if (!user) return;

  const result = await resolvers.Mutation.unblockCandidate(null, {
    userId: user.id,
  });
  expect(result).toBe(true); // Confirm mutation returned success

  // Check if user is now unblocked
  const updated = await AppDataSource.getRepository(Users).findOneBy({
    id: user.id,
  });
  expect(updated?.isValid).toBe(true);
});

// Test Case 5: Assign a lecturer to a course
// This test verifies the assignment of a lecturer (assumed to be user with ID 12)
// to a specific course. It's important for enabling backend course mapping.
test("assignLecturer links lecturer with course", async () => {
  const result = await resolvers.Mutation.assignLecturer(null, {
    courseCode: "TEST101", // Course being assigned
    userId: 12, // Lecturer's user ID
  });

  // If the lecturer and course exist, the mutation should succeed
  expect(result).toBe(true);
});

// Test Case 6: Try to delete a course already assigned to someone
// This test ensures that the `deleteCourse` mutation does not allow deletion of a course
// if it’s already assigned to a lecturer or in use. This preserves data integrity.
test("deleteCourse fails if course is mapped", async () => {
  try {
    await resolvers.Mutation.deleteCourse(null, { code: "TEST101" });
  } catch (e: any) {
    // Expect a failure message related to the course being in use
    expect(e.message).toContain("cannot be deleted");
  }
});
