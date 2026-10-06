# EduTrack — Project Description & Credentials

---

## What is EduTrack?

EduTrack is a **Student Academic and Result Management System** built for colleges and universities.
It helps administrators, credential managers, teachers, and students manage credentials (@gmail.com format), subjects, exam schedules, marks posting, results, password resets, and live security audit monitoring — all in one unified portal.

---

## System Role Credentials (@gmail.com Format)

| System Role | Full Name | Registered Email | Default Password | Responsibilities / Permissions |
|---|---|---|---|---|
| **Super Admin** | System Administrator | `admin@gmail.com` | `admin123` | Full system governance, academic setup, configuration & security oversight |
| **Credential Manager** | Credential Administrator | `manager@gmail.com` | `manager123` | Creating teacher & student credentials, editing/deleting accounts, password resets & live audit monitoring |
| **Teacher / Faculty** | Dr. Suresh Varma | `teacher@gmail.com` | `teacher123` | Managing subject schedules, entering student marks, reviewing branch performance |
| **Student** | Rahul Kumar | `student.rahul@gmail.com` | `student123` | Viewing personal academic results, semester grade cards, and performance history |

> All system login emails follow realistic `@gmail.com` formats as configured across the application and backend seeders.

---

## Credential Management & Security Features

1. **Credential Manager Role (`CREDENTIAL_MANAGER`)**:
   - Dedicated administration panel (`/credentials`).
   - Create Teacher credentials (Name, Email `@gmail.com`, Department, Phone, Password).
   - Create Student credentials (Student ID, Name, Email `@gmail.com`, Branch, Semester, Password).
   - Edit, Update, or Delete any Teacher or Student account.
   - Reset or change user passwords on demand.

2. **Forgot Password Workflow**:
   - "Forgot Password?" button on the login screen.
   - Users submit their registered `@gmail.com` email and reason for reset.
   - Credential Manager reviews pending requests and fulfills password resets with 1 click.

3. **Live Security Audit Monitoring**:
   - Live audit feed recording all system events (account creations, credential edits, deletions, password changes, logins).
   - Timestamped records with operator email, role, target user, action status, and details.

---

---

## How to Run the Project

### Step 1 — Run Backend (Spring Boot)
```bash
cd EduTrack/backend
mvn spring-boot:run
```
- Backend starts at: http://localhost:8080
- Auto-seeds default users, audit logs, students, subjects, schedules, and results.

### Step 2 — Run Frontend (React)
```bash
cd EduTrack/frontend
npm install
npm run dev
```
- Frontend starts at: http://localhost:5173

---

## Application URLs

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:5173      |
| Backend  | http://localhost:8080      |
| API Base | http://localhost:8080/api  |

---

## Technology Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Language   | Java 17                                 |
| Framework  | Spring Boot 3.2                         |
| Database   | MongoDB Atlas (Cloud)                   |
| DB Library | Spring Data MongoDB                     |
| Build Tool | Maven                                   |
| Frontend   | React.js 18 + Vite                      |
| Routing    | React Router v6                         |
| API Calls  | Axios                                   |
| Charts     | Recharts                                |
| Icons      | React Icons                             |
| Styling    | Vanilla CSS (custom design system)      |

---

## API Endpoints (Quick Reference)

```
POST /api/auth/login                  — Authenticate user (@gmail.com)
POST /api/auth/forgot-password        — Submit forgot password request
GET  /api/users                       — List user credentials
POST /api/users/teacher               — Create teacher credentials
POST /api/users/student               — Create student credentials
PUT  /api/users/{id}                  — Update user credentials
DELETE /api/users/{id}                — Delete user credentials
POST /api/users/{id}/change-password  — Reset/change password
GET  /api/users/monitoring/stats      — System credential statistics
GET  /api/users/monitoring/audit-logs — Live security audit log feed
GET  /api/users/reset-requests        — Pending password reset requests
POST /api/users/reset-requests/{id}/fulfill — Fulfill password reset
```
