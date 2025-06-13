TeachTeam Web Application

Git Repository: https://github.com/rmit-fsd-2025-s1/s4062691-s4069038-a2.git
Note: All code changes were tracked under the develop branch and merged into main as version-1.

User Authentication and Registration

Users can register as either a tutor or lecturer. The registration form captures the first name, last name, email, password, and role. Passwords are validated using a strength meter to ensure they contain at least 8 characters, one uppercase, one lowercase, one number, and one special symbol. Upon successful registration, users can log in and are redirected based on their assigned role.

The login system includes Google reCAPTCHA v2 to prevent bot access. All user data is encrypted and securely stored in the backend, and avatar image uploads are supported for personalized profiles.

Tutor Dashboard Functionality

Once signed in, tutors can submit applications for one or more courses. Each application includes inputs for course code, course name, role preference (e.g., Tutorial Assistant, Lab Assistant), availability (Full-time or Part-time), credentials, previous experience, and skill sets provided as comma-separated values.

Tutors can also upload a profile avatar, which is displayed in the top-right corner of their dashboard. The system shows their name, email, and date of joining as stored in the backend.

Tutor applications are saved via REST API calls and stored in the MySQL database. Multiple applications are allowed, and all data is persisted and retrievable across sessions.

Lecturer Dashboard Functionality

Each lecturer accesses a personalized dashboard that only displays tutor applications for the courses assigned to them by the admin. This course-to-lecturer mapping is pre-configured and managed through the Admin Panel. The lecturer dashboard includes a tab system: Applications, Selected Tutors, and Visual Analysis.

Within the Applications tab, lecturers can view applications filtered specifically for their assigned courses. They can apply filters by course name, tutor name, session type, skill set, and availability. Lecturers can select or deselect tutors. Selected tutors move to the Selected tab, where they can be ranked (1 to 10) and optionally commented on. Rankings and comments are stored in the backend via secure API calls.

If a tutor is unselected and then reselected, their previously submitted rank and comment are cleared to prevent misleading averages.

Visual Analysis Dashboard

This section displays a high-level summary across all lecturers. It includes the most selected and least selected tutors based on their average rank. It also lists tutors who have not been selected by any lecturer.

A full interactive table is displayed showing each tutor’s name, course, whether they are selected, the average rank calculated from all submitted lecturer reviews, and any comments provided. The rank shown is dynamically updated and reflects only valid (non-null) values. Deleted reviews or unselected tutors do not affect average calculations.

Backend Integration

The backend is implemented using Node.js with Express, TypeORM, and MySQL. All data operations including registration, login, tutor applications, rankings, selection tracking, and profile image uploads are handled through REST APIs. Validation is enforced on both the frontend and backend to ensure data integrity and security.

Profile and Avatar Feature

Both tutors and lecturers can upload an avatar image which is saved in the backend using Multer. The avatar is shown alongside user information such as name, email, and the date they joined. This creates a personalized experience for each logged-in user, and helps distinguish between users during review and selection.

Admin Dashboard (Independent Module)

A separate admin dashboard was built using React and GraphQL (Apollo Client). This admin panel is completely decoupled from the main TeachTeam app and communicates with the database only via GraphQL.

Admin should log in using the credentials admin / admin. Once authenticated, the admin can manage core system functions.

Admins can assign lecturers to one or more courses for the semester. This mapping ensures that lecturers only view and manage applications relevant to their assigned courses.

Admins can also add, edit, or delete course listings available for the semester. Additionally, they can block or unblock login access for tutor accounts if needed.

Admin can generate and view reports including: a list of tutors chosen for each course, tutors selected for more than three courses, and tutors who were not selected for any course.

Resources Used

Images are sourced from Unsplash for backgrounds and UI elements.
Avatars are sourced from UI Faces.
Icons are used from Google Fonts Icon set.

Final Notes

TeachTeam delivers a fully functional end-to-end system for tutor recruitment and selection. It includes secure registration, role-based dashboards, visual data analysis, and a centralized admin panel. The app is scalable, modular, and built with modern full-stack technologies. All functional and non-functional requirements have been successfully implemented and verified.

Note *** - If you are running this application with new database configurations, you need to add the courses and course mapping from the admin page (or) otherwise you can run the query that is mentioned in the dependencies.txt under the backend folder.

## References and Resources

This project was developed using a combination of course-provided materials, open-source tools, and generative AI assistance. All references are acknowledged below:

### Academic and Learning Materials

- RMIT COSC2758 Week 10 Tutorial Content – Used for understanding and implementing GraphQL mutations and queries within the Express backend.

### Tools & Generators

- **Mermaid AI**  
  URL: [https://www.mermaidchart.com/mermaid-ai](https://www.mermaidchart.com/mermaid-ai)  
  Used for generating the Entity-Relationship Diagram (ERD) from schema descriptions to visualise backend table relations.

### 🤖 Use of Generative AI (ChatGPT)

OpenAI's ChatGPT was used **ethically** as a learning and development aid during the project, The tool was used to:

- Generate TypeScript API call structures (e.g., in `UserContext.tsx`, `LecturerTabContent.tsx`)
- Help debug asynchronous state updates in React (`LecturersPage.tsx`)
- Suggest improvements in code readability, file modularisation, and backend endpoint structure
- Generate or reword README sections for clarity and academic compliance
- Guide logic separation for `VisualAnalysisDashboard.tsx` as per separation-of-concerns principles

> All AI-generated content was reviewed, edited, and integrated with our own logic. No direct AI-generated code was used without modification or human oversight.
