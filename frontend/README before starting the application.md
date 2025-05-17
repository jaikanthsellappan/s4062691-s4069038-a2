Git url => https://github.com/rmit-fsd-2025-s1/s4062691-s4069038-a1
# Note: The code changes are tracked in develop branch and finally we moved it to main branch as version-1
Please read this before starting the application , to know the background of our application
Introduction
TeachTeam is a web-based tutor recruitment system built using Next.js with TypeScript,all data is stored and retrieved using the browser’s localStorage.

User Roles
The system assumes two types of users:

4 tutors

4 lecturers

Their names, emails, and passwords are hardcoded into the system for testing purposes.

How the App Works
When the app launches, the homepage is shown first. From there, users can choose to go to either the Tutor or Lecturer section.
However, before accessing any protected section, users must sign in.

Tutor Features
Once logged in, tutors can:
Apply for one or more courses
Enter skills using comma-separated input (e.g. Python, React)
Choose their availability using a dropdown (Full-time or Part-time)
Each submitted application is stored in localStorage, and tutors can submit multiple applications.

Lecturer Features
Each lecturer has their own dashboard, which allows them to:
View all submitted tutor applications
Filter applications by course name, tutor name, skill, and availability
Sort tutors by course name
Select tutors, which moves them to the Selected tab
Rank tutors (only numbers between 1 and 10 are allowed)
Add optional comments about selected tutors

Visual Analysis Tab
This section is shared across all lecturers and provides:
The most selected and least selected tutors (based on average ranking from all lecturers)
A list of tutors who haven't been selected by any lecturer
A detailed table that shows:
Tutor name and course
Whether the tutor is selected
The average rank (calculated from all lecturers who reviewed that tutor)
All comments from individual lecturers

Security
A Google reCAPTCHA v2 (“I’m not a robot” checkbox) has been added to the login page to block bots from signing in.

Unit Testing
The project includes five unit tests written using Jest and React Testing Library. These tests cover key functionality:

The homepage renders all core text correctly
The sign-in form works with keyboard navigation (accessibility support)
Unauthenticated users trying to access the tutor page are redirected with an alert
Tutor rankings only accept values between 1–10
The visual analysis dashboard correctly shows top, bottom, and unselected tutors

Images Reference:
1) https://unsplash.com/ (images)
2) https://uifaces.co/ (avatars)
3) https://fonts.google.com/icons?selected=Material+Icons:home (icons)
