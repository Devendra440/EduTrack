## ?? Live Demo

**Frontend (Netlify):** https://edutrack-frontend-app.netlify.app
**Backend (Render API):** https://edutrack-backend-cu91.onrender.com/api/dashboard/ping

> *Note: The backend is hosted on Render's free tier and may take ~30-50 seconds to wake up from sleep. The frontend features a Smart Glassmorphism Loading UI to mask this cold start.*

# 🎓 EduTrack — Student Academic & Result Management System

![EduTrack Banner](https://via.placeholder.com/1200x300/1e40af/ffffff?text=EduTrack+%E2%80%94+Student+Academic+%26+Result+Management+System)

> A full-stack academic management system built with **Java Spring Boot**, **MongoDB Atlas**, and **React.js** — designed for colleges and universities to manage students, subjects, exam schedules, marks, and results.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [MongoDB Atlas Setup](#-mongodb-atlas-setup)
- [Backend Setup](#-backend-setup)
- [Frontend Setup](#-frontend-setup)
- [How to Run](#-how-to-run)
- [API Documentation](#-api-documentation)
- [Selenium Testing](#-selenium-testing)
- [Sample Credentials](#-sample-credentials)
- [Future Improvements](#-future-improvements)

---

## 📌 Project Overview

EduTrack is a **Student Academic and Result Management System** that allows administrators and faculty to:

- Register and manage students
- Manage subjects and branches
- Schedule examinations
- Post student marks
- Auto-calculate grades and results
- View academic performance and top performers
- Generate printable result cards

The project is built for demonstration in technical interviews, showcasing full-stack development skills using modern industry technologies.

---

## ✅ Features

| Feature | Description |
|---|---|
| 👨‍🎓 Student Management | Add, edit, delete, search students by name/branch/semester |
| 📚 Subject Management | Manage subjects with code, branch, semester, credits |
| 📅 Exam Schedules | Create exam schedules with dynamic status calculation |
| 📝 Marks Posting | Enter and submit student marks per exam |
| 🏆 Result Calculation | Auto-calculate percentage, grade (A+/A/B/C/D/F), pass/fail |
| 📊 Dashboard | Stats cards, charts, upcoming exams, marks deadlines |
| 🔍 Search & Filter | Search and filter across all modules |
| 🖨️ Print Results | Print-friendly result card for each student |
| 📱 Responsive UI | Works on desktop, tablet, and mobile |

---

## 🛠️ Technology Stack

### Backend
| Technology | Purpose |
|---|---|
| Java 17 | Core programming language |
| Spring Boot 3.2 | Application framework |
| Spring MVC | REST API controllers |
| Spring Data MongoDB | Database integration |
| MongoDB Atlas | Cloud NoSQL database |
| Maven | Dependency management |
| Lombok | Reduce boilerplate code |

### Frontend
| Technology | Purpose |
|---|---|
| React.js 18 | UI framework |
| Vite | Build tool and dev server |
| React Router v6 | Client-side routing |
| Axios | HTTP API calls |
| Recharts | Dashboard charts |
| React Icons | Icon library |
| Vanilla CSS | Custom styling |

### Testing
| Technology | Purpose |
|---|---|
| Selenium WebDriver 4 | Browser automation |
| TestNG | Test framework |
| WebDriverManager | Auto ChromeDriver management |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (React)                  │
│              http://localhost:5173                  │
│                                                     │
│  Login → Dashboard → Students → Subjects →          │
│  Schedules → Marks → Results → Performance          │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP (Axios)
                       ▼
┌─────────────────────────────────────────────────────┐
│              Backend (Spring Boot)                  │
│              http://localhost:8080                  │
│                                                     │
│  Controller → Service → Repository                  │
│  /api/students  /api/subjects  /api/marks           │
│  /api/schedules /api/results   /api/dashboard       │
└──────────────────────┬──────────────────────────────┘
                       │ Spring Data MongoDB
                       ▼
┌─────────────────────────────────────────────────────┐
│              MongoDB Atlas (Cloud)                  │
│                                                     │
│  Collections: students, subjects, schedules,        │
│               marks, results                        │
└─────────────────────────────────────────────────────┘
```

### Layered Architecture
```
Controller    →   Handles HTTP requests/responses
    ↓
Service       →   Business logic (grade calculation, validation)
    ↓
Repository    →   MongoDB queries (Spring Data)
    ↓
MongoDB Atlas →   Cloud database (NoSQL)
```

---

## 📁 Project Structure

```
EduTrack/
│
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/edutrack/
│       ├── EdutrackApplication.java
│       ├── DataSeeder.java                ← Seeds sample data on startup
│       ├── controller/
│       │   ├── StudentController.java
│       │   ├── SubjectController.java
│       │   ├── ScheduleController.java
│       │   ├── MarksController.java
│       │   ├── ResultController.java
│       │   └── DashboardController.java
│       ├── service/
│       │   ├── StudentService.java
│       │   ├── SubjectService.java
│       │   ├── ScheduleService.java
│       │   ├── MarksService.java
│       │   ├── ResultService.java
│       │   └── DashboardService.java
│       ├── repository/
│       │   ├── StudentRepository.java
│       │   ├── SubjectRepository.java
│       │   ├── ScheduleRepository.java
│       │   ├── MarksRepository.java
│       │   └── ResultRepository.java
│       ├── model/
│       │   ├── Student.java
│       │   ├── Subject.java
│       │   ├── Schedule.java
│       │   ├── Marks.java
│       │   └── Result.java
│       └── exception/
│           ├── GlobalExceptionHandler.java
│           ├── StudentNotFoundException.java
│           ├── SubjectNotFoundException.java
│           ├── ScheduleNotFoundException.java
│           ├── MarksNotFoundException.java
│           ├── ResultNotFoundException.java
│           ├── DuplicateStudentIdException.java
│           └── InvalidMarksException.java
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Sidebar.jsx
│       │   │   ├── Navbar.jsx
│       │   │   └── AppLayout.jsx
│       │   └── common/
│       │       ├── StatsCard.jsx
│       │       ├── StatusBadge.jsx
│       │       ├── LoadingSpinner.jsx
│       │       ├── EmptyState.jsx
│       │       ├── Toast.jsx
│       │       ├── ConfirmDialog.jsx
│       │       ├── Modal.jsx
│       │       └── SearchBar.jsx
│       ├── pages/
│       │   ├── LoginPage.jsx
│       │   ├── DashboardPage.jsx
│       │   ├── StudentsPage.jsx
│       │   ├── StudentProfilePage.jsx
│       │   ├── SubjectsPage.jsx
│       │   ├── SchedulesPage.jsx
│       │   ├── MarksPage.jsx
│       │   ├── ResultsPage.jsx
│       │   ├── ResultHistoryPage.jsx
│       │   └── PerformancePage.jsx
│       └── services/
│           ├── api.js
│           ├── studentService.js
│           ├── subjectService.js
│           ├── scheduleService.js
│           ├── marksService.js
│           ├── resultService.js
│           └── dashboardService.js
│
├── selenium-tests/
│   ├── pom.xml
│   ├── testng.xml
│   └── src/test/java/com/edutrack/selenium/
│       ├── BaseTest.java
│       ├── LoginTest.java
│       ├── StudentTest.java
│       ├── SubjectTest.java
│       ├── ScheduleTest.java
│       ├── MarksTest.java
│       └── ResultTest.java
│
├── .gitignore
├── .env.example
└── README.md
```

---

## 🌐 MongoDB Atlas Setup

Follow these steps to set up MongoDB Atlas:

### Step 1: Create a Free Atlas Account
1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Click **"Try Free"** and create an account

### Step 2: Create a Free Cluster
1. Choose **M0 Free Tier**
2. Select your preferred region (any is fine)
3. Name your cluster (e.g., `Cluster0`)
4. Click **Create**

### Step 3: Create a Database User
1. Go to **Database Access** → **Add New Database User**
2. Username: `admin`
3. Set a strong password (save it!)
4. Role: **Atlas Admin**
5. Click **Add User**

### Step 4: Set Network Access
1. Go to **Network Access** → **Add IP Address**
2. Click **"Allow Access from Anywhere"** (for development)
3. Click **Confirm**

### Step 5: Get Connection String
1. Go to your Cluster → **Connect**
2. Choose **Connect your application**
3. Driver: Java, Version: 5.1 or later
4. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0
   ```
5. Replace `<password>` with your actual password

### Step 6: Configure Backend
Update `backend/src/main/resources/application.properties`:
```properties
spring.data.mongodb.uri=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/edutrack?appName=Cluster0
spring.data.mongodb.database=edutrack
```

---

## ⚙️ Backend Setup

### Prerequisites
- Java 17 or later ([Download](https://adoptium.net/))
- Maven 3.8+ ([Download](https://maven.apache.org/download.cgi))

### Steps

1. Navigate to backend folder:
   ```bash
   cd EduTrack/backend
   ```

2. Update MongoDB URI in `src/main/resources/application.properties`

3. Build the project:
   ```bash
   mvn clean install
   ```

4. Run the application:
   ```bash
   mvn spring-boot:run
   ```

5. Backend starts at: `http://localhost:8080`

> **Note:** On first run, `DataSeeder.java` automatically inserts sample data into MongoDB (10 students, 12 subjects, 4 schedules, marks, and results). This only runs once — if data exists, it skips seeding.

---

## 💻 Frontend Setup

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- npm (comes with Node.js)

### Steps

1. Navigate to frontend folder:
   ```bash
   cd EduTrack/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Frontend opens at: `http://localhost:5173`

---

## 🚀 How to Run

Run both backend and frontend simultaneously:

### Terminal 1 — Backend
```bash
cd EduTrack/backend
mvn spring-boot:run
```

### Terminal 2 — Frontend
```bash
cd EduTrack/frontend
npm install
npm run dev
```

### Access the App
Open your browser and go to: **http://localhost:5173**

---

## 📡 API Documentation

### Base URL: `http://localhost:8080/api`

### Students
| Method | Endpoint | Description |
|---|---|---|
| GET | `/students` | Get all students (supports ?name=&branch=&semester=) |
| GET | `/students/{id}` | Get student by MongoDB ID |
| GET | `/students/by-student-id/{studentId}` | Get student by ST101 format ID |
| POST | `/students` | Create new student |
| PUT | `/students/{id}` | Update student |
| DELETE | `/students/{id}` | Delete student |

### Subjects
| Method | Endpoint | Description |
|---|---|---|
| GET | `/subjects` | Get all subjects |
| GET | `/subjects/{id}` | Get subject by ID |
| POST | `/subjects` | Create new subject |
| PUT | `/subjects/{id}` | Update subject |
| DELETE | `/subjects/{id}` | Delete subject |

### Schedules
| Method | Endpoint | Description |
|---|---|---|
| GET | `/schedules` | Get all schedules (with calculated status) |
| GET | `/schedules/upcoming` | Get upcoming exams |
| GET | `/schedules/marks-pending` | Get schedules awaiting marks |
| POST | `/schedules` | Create new schedule |
| PUT | `/schedules/{id}` | Update schedule |
| DELETE | `/schedules/{id}` | Delete schedule |

### Marks
| Method | Endpoint | Description |
|---|---|---|
| GET | `/marks/student/{studentId}` | Get all marks for a student |
| GET | `/marks/schedule/{scheduleId}` | Get marks for a schedule |
| POST | `/marks` | Save/enter marks |
| PUT | `/marks/{id}` | Update marks |
| POST | `/marks/{id}/submit` | Submit marks (lock) |
| DELETE | `/marks/{id}` | Delete marks entry |

### Results
| Method | Endpoint | Description |
|---|---|---|
| POST | `/results/calculate` | Calculate and save result |
| GET | `/results/student/{studentId}` | Get all results for student |
| GET | `/results/student/{studentId}/semester/{semester}` | Get result by semester |
| GET | `/results` | Get all results |
| GET | `/results/top-performers?limit=10` | Get top N students |

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard/stats` | Get dashboard statistics |
| GET | `/dashboard/branch-distribution` | Student count per branch |
| GET | `/dashboard/result-performance` | Pass/fail counts |
| GET | `/dashboard/semester-performance` | Avg % per semester |
| GET | `/dashboard/upcoming-exams` | Next upcoming exams |
| GET | `/dashboard/marks-posting-status` | Marks submission status |
| GET | `/dashboard/recent-activity` | Recent system activity |
| GET | `/dashboard/notifications` | Alerts and notifications |
| GET | `/dashboard/top-performers` | Top 5 students |

### Grade System
| Percentage | Grade |
|---|---|
| 90 – 100 | A+ |
| 80 – 89 | A |
| 70 – 79 | B |
| 60 – 69 | C |
| 50 – 59 | D |
| Below 50 | F (Fail) |

---

## 🧪 Selenium Testing

### Prerequisites
- Chrome browser installed
- Java 17+
- Both backend AND frontend must be running

### How to Run Tests

```bash
cd EduTrack/selenium-tests
mvn test
```

### Test Cases

| Test Class | Test Methods | Description |
|---|---|---|
| `LoginTest` | 3 tests | Page loads, wrong credentials, correct login |
| `StudentTest` | 3 tests | Page loads, search, add student |
| `SubjectTest` | 3 tests | Page loads, add subject, filter |
| `ScheduleTest` | 3 tests | Page loads, status badges, create schedule |
| `MarksTest` | 2 tests | Page loads, filter by branch/semester |
| `ResultTest` | 4 tests | Page loads, search by ID, verify grade, performance page |

> **Note:** WebDriverManager automatically downloads the correct ChromeDriver — no manual setup needed.

---

## 🔑 Sample Credentials

### Application Login
| Field | Value |
|---|---|
| Email | `admin@edutrack.com` |
| Password | `admin123` |

> This is a demo login for portfolio/interview purposes. No real authentication is implemented.

### Sample Students (auto-seeded)
| Student ID | Name | Branch | Semester |
|---|---|---|---|
| ST101 | Rahul Kumar | CSE | 5th Semester |
| ST102 | Priya Sharma | IT | 5th Semester |
| ST103 | Arjun Reddy | CSE | 5th Semester |
| ST104 | Ananya Singh | ECE | 3rd Semester |
| ST105 | Vikram Patel | CSE | 3rd Semester |
| ST106 | Deepika Nair | IT | 3rd Semester |
| ST107 | Rohit Gupta | EEE | 5th Semester |
| ST108 | Sneha Joshi | ME | 3rd Semester |
| ST109 | Aditya Kumar | CSE | 7th Semester |
| ST110 | Meera Pillai | IT | 7th Semester |

### Search Results
To see a result, go to **Results** → enter **ST101** → click Search.

---

## 🔮 Future Improvements

| Feature | Description |
|---|---|
| JWT Authentication | Secure role-based login (Admin/Faculty/Student) |
| Student Portal | Students can login and view their own results |
| Email Notifications | Send results via email using Spring Mail |
| PDF Generation | Server-side PDF using iText or JasperReports |
| Bulk Marks Import | Upload CSV to import marks |
| Attendance Module | Track student attendance |
| Fee Management | Basic fee tracking and payment status |
| Mobile App | React Native app for students |

---

## 👨‍💻 Skills Demonstrated

```
✅ Java 17
✅ Spring Boot 3.2
✅ Spring MVC & REST APIs
✅ Spring Data MongoDB
✅ MongoDB Atlas (Cloud Database)
✅ CRUD Operations
✅ Custom Exception Handling
✅ Data Validation
✅ React.js 18 (Functional Components + Hooks)
✅ React Router v6 (Client-side Navigation)
✅ Axios (API Communication)
✅ Recharts (Dashboard Charts)
✅ Responsive CSS Design
✅ Form Validation (Frontend & Backend)
✅ Selenium WebDriver 4 Automation Testing
✅ TestNG Test Framework
✅ Maven Build Management
✅ NoSQL Database Design
✅ Dynamic Grade Calculation
✅ Date-based Status Calculation
```

---

## 📄 License

This project is created for academic and interview demonstration purposes.

---

*Built with ❤️ using Java, Spring Boot, MongoDB, and React.js*

