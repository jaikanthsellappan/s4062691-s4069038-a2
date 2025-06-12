import gql from "graphql-tag";

export const typeDefs = gql`
  type Course {
    code: String!
    name: String!
    isAvailable: Boolean!
  }

  type User {
    id: Int!
    email: String!
    firstName: String!
    lastName: String!
    role: String!
    isValid: Boolean!
  }

  type CourseWithUsers {
  courseCode: String!
  users: [User!]!
}

type CourseMapping {
  userId: Int!
  courseCode: String!
}

  # Add this new type for report grouping
  type CourseWithUsers {
    courseCode: String!
    users: [User!]!
  }

  type CourseCandidates {
  courseCode: String!
  users: [User!]!
}

  type Query {
    getCourses: [Course!]!
    getUsers: [User!]!
    getCourseMappings: [CourseMapping!]!
    validateAdminLogin(email: String!): Boolean!

    getCandidatesPerCourseDetailed: [CourseCandidates!]!
    getOverChosenCandidatesDetailed: [User!]!
    getUnchosenCandidatesDetailed: [User!]!
  }

  type Mutation {
    addCourse(code: String!, name: String!): Course
    editCourse(code: String!, name: String!, isAvailable: Boolean!): Course
    deleteCourse(code: String!): Boolean

    assignLecturer(courseCode: String!, userId: Int!): Boolean

    blockCandidate(userId: Int!): Boolean
    unblockCandidate(userId: Int!): Boolean
  }
`;
