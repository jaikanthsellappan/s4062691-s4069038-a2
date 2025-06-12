import { gql } from "@apollo/client";

// --- Courses ---
export const GET_COURSES = gql`
  query GetCourses {
    getCourses {
      code
      name
      isAvailable
    }
  }
`;

export const GET_COURSE_MAPPINGS = gql`
  query {
    getCourseMappings {
      userId
      courseCode
    }
  }
`;

export const VALIDATE_ADMIN_LOGIN = gql`
  query ValidateAdminLogin($email: String!) {
    validateAdminLogin(email: $email)
  }
`;

export const ADD_COURSE = gql`
  mutation AddCourse($code: String!, $name: String!) {
    addCourse(code: $code, name: $name) {
      code
      name
      isAvailable
    }
  }
`;

export const EDIT_COURSE = gql`
  mutation EditCourse($code: String!, $name: String!, $isAvailable: Boolean!) {
    editCourse(code: $code, name: $name, isAvailable: $isAvailable) {
      code
      name
      isAvailable
    }
  }
`;

export const DELETE_COURSE = gql`
  mutation DeleteCourse($code: String!) {
    deleteCourse(code: $code)
  }
`;

// --- Users ---
export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      firstName
      lastName
      email
      isValid
      role
    }
  }
`;

export const ASSIGN_LECTURER = gql`
  mutation AssignLecturer($courseCode: String!, $userId: Int!) {
    assignLecturer(courseCode: $courseCode, userId: $userId)
  }
`;

export const BLOCK_CANDIDATE = gql`
  mutation BlockCandidate($userId: Int!) {
    blockCandidate(userId: $userId)
  }
`;

export const UNBLOCK_CANDIDATE = gql`
  mutation UnblockCandidate($userId: Int!) {
    unblockCandidate(userId: $userId)
  }
`;

// --- Reports ---
export const GET_CANDIDATES_PER_COURSE_DETAILED = gql`
  query {
    getCandidatesPerCourseDetailed {
      courseCode
      users {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

export const GET_OVERCHOSEN_CANDIDATES_DETAILED = gql`
  query {
    getOverChosenCandidatesDetailed {
      id
      firstName
      lastName
      email
    }
  }
`;

export const GET_UNCHOSEN_CANDIDATES_DETAILED = gql`
  query {
    getUnchosenCandidatesDetailed {
      id
      firstName
      lastName
      email
      role
      isValid
    }
  }
`;
