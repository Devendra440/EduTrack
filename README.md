# 🎓 EduTrack

> A professional, full-stack Student Academic & Result Management System designed for modern educational institutions.

[![Frontend](https://img.shields.io/badge/Frontend-React_18-61DAFB?logo=react&logoColor=black)](#)
[![Backend](https://img.shields.io/badge/Backend-Spring_Boot_3-6DB33F?logo=spring&logoColor=white)](#)
[![Database](https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?logo=mongodb&logoColor=white)](#)
[![Deployment](https://img.shields.io/badge/Deployment-Live-success)](#)

## 🌐 Live Demo

- **Frontend Application:** [https://edutrack-frontend-app.netlify.app](https://edutrack-frontend-app.netlify.app)
- **Backend API (Health Check):** [https://edutrack-backend-cu91.onrender.com/api/dashboard/ping](https://edutrack-backend-cu91.onrender.com/api/dashboard/ping)

> **Note:** The backend is hosted on Render's free tier and may take ~30-50 seconds to wake up from sleep. The frontend features a **Smart Glassmorphism Loading UI** to seamlessly mask this cold start and provide an engaging user experience.

---

## 🔑 Demo Credentials

To access the administrative dashboard, use the following sample credentials:

- **Email:** `admin@edutrack.com`
- **Password:** `admin123`

*(Note: The system utilizes Role-Based Access Control. This account provides full Admin access to explore all features.)*

---

## ✨ Key Features

- **Role-Based Access Control (RBAC):** Secure routing and action restrictions mapped to `ADMIN`, `TEACHER`, `STUDENT`, and `CREDENTIAL_MANAGER` profiles.
- **Smart Asymptotic Loader:** A dynamic glassmorphism progress bar that elegantly estimates cloud server wake-up sequences.
- **Analytics Dashboard:** Real-time statistics, branch distribution pie charts, and performance bar charts powered by Recharts.
- **Academic Management:** Comprehensive CRUD operations for Students, Subjects, and Exam Schedules.
- **Dynamic Status Tracking:** Exam schedules automatically calculate and update their status (*Upcoming*, *Ongoing*, *Marks Pending*, *Completed*) based on the current system date.
- **Automated Grading Engine:** Intelligent grade calculation (A+, A, B, C, D, F), total marks formulation, and pass/fail evaluation.

---

## 🛠️ Technology Stack

**Frontend Integration:**
- React 18 (Hooks, Functional Components)
- React Router v6
- Vite Build Tool
- Axios
- Recharts (Data Visualization)
- Custom CSS3 / Modern Glassmorphism UI

**Backend Architecture:**
- Java 17
- Spring Boot 3.2 (Web, Data MongoDB, Validation)
- Maven
- Lombok

**Database & Cloud Infrastructure:**
- MongoDB Atlas (Cloud NoSQL)
- Netlify (Global CDN Frontend Hosting)
- Render (Backend Web Service Hosting)

---

## 🏗️ System Architecture

EduTrack is designed using a decoupled client-server architecture:

1. **Presentation Layer (React Frontend):**
   - Developed using Vite for rapid HMR and optimized builds.
   - Hosted on **Netlify**, leveraging its global CDN edge nodes for instantaneous delivery.
   - Uses `react-router-dom` for client-side routing, protected by RBAC wrappers.
   - Communicates with the backend asynchronously using `axios`.

2. **Application Layer (Spring Boot Backend):**
   - Developed using Java 17 and Spring Boot 3.2.
   - Follows the Controller-Service-Repository pattern for clean separation of concerns.
   - Hosted on **Render** (Docker containerized) as a stateless Web Service.
   - Includes custom global exception handling and DTO projections.

3. **Data Layer (MongoDB Atlas):**
   - Cloud-native NoSQL document database.
   - Ensures flexible schema design for rapid feature iterations.
   - Secured via IP whitelisting and robust authentication parameters.

---

## ☁️ Deployment Pipeline

This repository is configured with a modern CI/CD approach:

- **Frontend CI/CD:** Connected to Netlify. A `_redirects` file is utilized in the build output to route all traffic to `index.html`, preventing 404 errors during client-side navigation. Any push to the `main` branch automatically triggers a new Netlify production build.
- **Backend CI/CD:** Connected to Render. Utilizing a multi-stage `Dockerfile`, Render automatically pulls the latest commit, builds the `.jar` using Maven, and deploys it on an Alpine JRE container.
- **Security:** Secrets like `MONGO_URI` are injected directly into the cloud hosting environments as protected environment variables, completely omitted from the repository.

---

## 🚀 Local Development Setup

### Prerequisites
- [Java 17+](https://adoptium.net/)
- [Node.js 18+](https://nodejs.org/)
- [Maven 3.8+](https://maven.apache.org/)

### 1. Backend Configuration
Navigate to the backend directory:
```bash
cd backend
```
Create a `.env` file based on `.env.example` and add your MongoDB cluster URI:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0...
```
Build and run the Spring Boot server:
```bash
mvn clean install
mvn spring-boot:run
```
*The backend will initialize at `http://localhost:8080`. Note: Sample demo data is automatically seeded into the database on the very first run.*

### 2. Frontend Configuration
Navigate to the frontend directory:
```bash
cd frontend
```
Install dependencies and start the Vite dev server:
```bash
npm install
npm run dev
```
*The frontend application will be served at `http://localhost:5173`.*

---

## 📄 License

This project is created for academic and interview demonstration purposes.
